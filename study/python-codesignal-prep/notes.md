# Python CodeSignal Prep — Constellation Astra / OpenAI Safety Fellowship

Dense reference + worked examples for the 90-minute, 6-level Python coding screen.
Prerequisites named in the invite: **functions**, **lists & dictionaries**, **concurrency** (asyncio or threading), **`unittest`**.

---

## Table of Contents

1. [Functions](#1-functions)
2. [Lists & tuples](#2-lists--tuples)
3. [Dicts & sets](#3-dicts--sets)
4. [Strings](#4-strings)
5. [Concurrency primer](#5-concurrency-primer)
6. [Threading](#6-threading)
7. [asyncio](#7-asyncio)
8. [Threading vs asyncio — same problem, both ways](#8-threading-vs-asyncio--same-problem-both-ways)
9. [`unittest`](#9-unittest)
10. [LeetCode-style patterns](#10-leetcode-style-patterns)
11. [CodeSignal test-taking strategy](#11-codesignal-test-taking-strategy)

---

## 1. Functions

### 1.1 Signatures, defaults, `*args`, `**kwargs`

```python
def f(a, b, c=10, *args, d, e=5, **kwargs):
    # a, b           -> positional-or-keyword
    # c=10           -> positional-or-keyword with default
    # *args          -> remaining positionals as tuple
    # d              -> KEYWORD-ONLY (after *args), required
    # e=5            -> keyword-only with default
    # **kwargs       -> remaining keywords as dict
    ...

f(1, 2, 3, 4, 5, d=99, x="hi")   # a=1 b=2 c=3 args=(4,5) d=99 e=5 kwargs={'x':'hi'}
```

**Positional-only / keyword-only markers** (Python 3.8+):

```python
def g(a, b, /, c, d, *, e, f):
    # a, b -> POSITIONAL ONLY (before /)
    # c, d -> positional-or-keyword
    # e, f -> KEYWORD ONLY (after *)
    ...
```

**Mutable default trap** — defaults are evaluated once at def time:

```python
def bad(x, items=[]):       # DON'T: same list across calls
    items.append(x); return items

def good(x, items=None):
    if items is None: items = []
    items.append(x); return items
```

**Unpacking at call site**:

```python
args = (1, 2); kw = {"c": 3}
f(*args, **kw)               # spreads into positional + keyword
```

### 1.2 Closures

A function defined inside another captures enclosing variables by reference.

```python
def make_counter():
    n = 0
    def inc():
        nonlocal n           # without nonlocal, `n += 1` errors
        n += 1
        return n
    return inc

c = make_counter()
c(); c(); c()                # -> 3
```

`nonlocal` rebinds in the enclosing function scope; `global` rebinds at module scope.

### 1.3 Decorators

A decorator is a callable that takes a function and returns a (usually wrapped) function.

```python
import functools, time

def timed(fn):
    @functools.wraps(fn)     # preserves __name__, __doc__
    def wrapper(*args, **kwargs):
        t0 = time.perf_counter()
        try:
            return fn(*args, **kwargs)
        finally:
            print(f"{fn.__name__}: {time.perf_counter()-t0:.4f}s")
    return wrapper

@timed
def slow(n): return sum(range(n))
```

**Decorator with arguments** — outer factory returns a decorator:

```python
def retry(times):
    def deco(fn):
        @functools.wraps(fn)
        def wrapper(*a, **kw):
            for i in range(times):
                try: return fn(*a, **kw)
                except Exception as e:
                    last = e
            raise last
        return wrapper
    return deco

@retry(times=3)
def flaky(): ...
```

### 1.4 `lambda` and higher-order helpers

```python
square = lambda x: x * x                  # expression only, no statements
sorted(words, key=lambda w: (len(w), w))  # sort by length, then lex
list(map(str.upper, ["a","b"]))           # ['A','B']
list(filter(lambda x: x % 2, range(10)))  # odds
from functools import reduce
reduce(lambda a, b: a + b, [1,2,3,4], 0)  # 10
```

### 1.5 Type hints (read-only on the test, but tests may use them)

```python
from typing import Optional, Iterable, Callable

def pick(xs: list[int], pred: Callable[[int], bool]) -> Optional[int]:
    for x in xs:
        if pred(x): return x
    return None
```

### 1.6 Recursion essentials

```python
import sys; sys.setrecursionlimit(10_000)  # bump if deep

from functools import lru_cache
@lru_cache(maxsize=None)
def fib(n): return n if n < 2 else fib(n-1) + fib(n-2)
```

### 1.7 Generators (often clean LeetCode solutions)

```python
def take(n, it):
    for i, x in enumerate(it):
        if i >= n: break
        yield x

def stream_pairs(xs):
    it = iter(xs); prev = next(it, None)
    for x in it:
        yield prev, x
        prev = x
```

---

## 2. Lists & tuples

### 2.1 Core operations and complexity

```python
xs = [3, 1, 4, 1, 5]
xs.append(9)         # O(1) amortized
xs.pop()             # O(1)        — pop from end
xs.pop(0)            # O(n)        — pop from front; use collections.deque instead
xs.insert(0, 99)     # O(n)
xs.extend([7, 8])    # O(k)
xs.remove(1)         # O(n)        — removes FIRST occurrence
del xs[2]            # O(n)
xs.index(5)          # O(n)        — ValueError if missing
xs.count(1)          # O(n)
xs.reverse()         # in-place
xs.sort()            # in-place, O(n log n), stable
sorted(xs)           # returns new list
len(xs); 5 in xs     # O(1); O(n)
```

### 2.2 Slicing (always returns a copy for lists)

```python
xs[a:b]              # indices a..b-1
xs[a:b:s]            # step s (s can be negative)
xs[::-1]             # reversed copy
xs[:] = [1,2,3]      # replace contents in place (keeps same list object)
```

### 2.3 Sorting with `key` and `reverse`

```python
words = ["apple", "Fig", "banana"]
sorted(words, key=str.lower)
sorted(items, key=lambda p: (p[1], -p[0]))   # by second asc, first desc
from operator import itemgetter, attrgetter
sorted(rows, key=itemgetter(2, 0))
```

`sort` is **stable**: equal keys keep original order. To sort by multiple criteria where some are descending and others ascending and the keys are not numeric, do multiple passes from least-significant to most-significant (relies on stability).

### 2.4 List comprehensions

```python
[x*x for x in range(10)]
[x for x in xs if x > 0]
[(i, x) for i, x in enumerate(xs)]
[y for row in matrix for y in row]            # flatten one level
[[0]*cols for _ in range(rows)]               # 2D grid (NOT [[0]*c]*r — aliased!)
```

### 2.5 Common idioms

```python
# Stack
stack = []
stack.append(x); top = stack[-1]; x = stack.pop()

# Queue / deque (O(1) from both ends)
from collections import deque
q = deque([1,2,3])
q.append(4); q.appendleft(0); q.pop(); q.popleft()
q = deque(maxlen=5)              # ring buffer

# Two-pointer
def two_sum_sorted(a, target):
    i, j = 0, len(a) - 1
    while i < j:
        s = a[i] + a[j]
        if s == target: return [i, j]
        if s < target: i += 1
        else: j -= 1
    return [-1, -1]

# Sliding window (longest substring without repeats)
def longest_unique(s):
    last = {}; best = lo = 0
    for hi, ch in enumerate(s):
        if ch in last and last[ch] >= lo:
            lo = last[ch] + 1
        last[ch] = hi
        best = max(best, hi - lo + 1)
    return best

# Enumerate + zip
for i, (a, b) in enumerate(zip(xs, ys)):
    ...

# Unpacking
first, *middle, last = [1,2,3,4,5]            # 1, [2,3,4], 5
```

### 2.6 Tuples (immutable, hashable if elements are)

```python
p = (3, 4); x, y = p
record = (name, age, score)                   # cheap aggregate
# Tuples are valid dict keys / set elements; lists are not.
seen = {(r, c) for r, c in visited}
```

---

## 3. Dicts & sets

### 3.1 Dict operations

```python
d = {"a": 1, "b": 2}
d["c"] = 3
d.get("x")                # None if missing
d.get("x", 0)             # default 0
d.setdefault("k", [])     # returns existing or sets to default and returns it
d.pop("a")                # removes and returns
d.pop("z", None)          # safe pop
"a" in d                  # O(1) membership
list(d); list(d.values()); list(d.items())
d.update(other_dict)
{**d1, **d2}              # merge (right wins)
d1 | d2                   # merge (3.9+)
```

**Insertion-ordered** since 3.7. Iteration follows insertion order.

### 3.2 `defaultdict` (always reach for this in grouping problems)

```python
from collections import defaultdict
groups = defaultdict(list)
for word in words:
    key = "".join(sorted(word))
    groups[key].append(word)
return list(groups.values())     # group anagrams

counts = defaultdict(int)
for x in xs: counts[x] += 1      # equivalent to Counter for ints
```

### 3.3 `Counter`

```python
from collections import Counter
c = Counter("mississippi")       # Counter({'i':4,'s':4,'p':2,'m':1})
c.most_common(2)                 # [('i',4), ('s',4)]
c1 + c2; c1 - c2; c1 & c2; c1 | c2   # multiset arithmetic (drops <=0)
c.update("more text")
sum(c.values())                  # total count
```

### 3.4 Dict comprehensions

```python
{k: v for k, v in pairs}
{k: v for k, v in d.items() if v > 0}
{v: k for k, v in d.items()}             # invert (assumes unique values)
{i: ch for i, ch in enumerate(s)}
```

### 3.5 Sets

```python
s = {1, 2, 3}
s.add(4); s.discard(99)          # discard = remove without KeyError
s & t; s | t; s - t; s ^ t       # intersect, union, diff, symdiff
s.issubset(t); s.isdisjoint(t)
frozenset([1,2])                 # hashable, can be a dict key
{x*x for x in xs}                # set comp
```

### 3.6 Worked: top-K frequent elements

```python
import heapq
from collections import Counter

def top_k_frequent(nums, k):
    c = Counter(nums)
    # heapq is a min-heap; push (count, num) and pop smallest until k left,
    # or use nlargest for clarity:
    return [x for x, _ in c.most_common(k)]

# Equivalent with heap (O(n log k)):
def top_k_heap(nums, k):
    c = Counter(nums)
    return heapq.nlargest(k, c, key=c.get)
```

### 3.7 Worked: group anagrams

```python
from collections import defaultdict
def group_anagrams(words):
    groups = defaultdict(list)
    for w in words:
        groups[tuple(sorted(w))].append(w)  # tuple is hashable; sorted string also fine
    return list(groups.values())
```

### 3.8 `heapq` (mentioned because LeetCode loves heaps)

```python
import heapq
h = []
heapq.heappush(h, 5); heapq.heappush(h, 1); heapq.heappush(h, 3)
heapq.heappop(h)                 # 1   (MIN-heap)
heapq.heapify(xs)                # in place, O(n)
heapq.nsmallest(k, xs); heapq.nlargest(k, xs)
# Max-heap trick: negate values
heapq.heappush(h, -x); -heapq.heappop(h)
# Tuple keys for tie-breaking:
heapq.heappush(h, (priority, seq, task))
```

---

## 4. Strings

### 4.1 Basics (strings are immutable)

```python
s = "hello world"
s.upper(); s.lower(); s.title(); s.swapcase()
s.startswith("he"); s.endswith("ld")
s.find("o"); s.rfind("o")          # -1 if missing
s.index("o")                       # ValueError if missing
s.count("l")
s.replace("l", "L", 1)             # max-count optional
s.strip(); s.lstrip(",. "); s.rstrip()
s.split(); s.split(",", 2); s.rsplit()
"".join(parts); ",".join(parts)
s.isdigit(); s.isalpha(); s.isalnum(); s.isspace()
s.zfill(5); s.rjust(8, "0")
```

### 4.2 Formatting

```python
f"{name}: {value:>8.2f}"           # right-aligned, width 8, 2 decimals
f"{n:,}"                           # 1,234,567
f"{n:b}"                           # binary
f"{x!r}"                           # repr()
"{0} {1} {0}".format("a", "b")
```

### 4.3 Building strings efficiently

```python
# DON'T concatenate in a loop -> O(n^2)
out = ""
for w in words: out += w           # bad

# Use join (O(n))
out = "".join(words)

# For lots of incremental writes, io.StringIO is fine
import io
buf = io.StringIO()
for w in words: buf.write(w)
out = buf.getvalue()
```

### 4.4 Useful idioms

```python
# Reverse
s[::-1]

# Palindrome check (ignoring case + non-alphanumeric)
def is_palin(s):
    t = [c.lower() for c in s if c.isalnum()]
    return t == t[::-1]

# Char counts
from collections import Counter
Counter(s)

# ord / chr
ord('a')          # 97
chr(97)           # 'a'
[ord(c) - ord('a') for c in "abc"]

# Splitting words while keeping delimiters predictable
import re
re.split(r"\s+", text.strip())
re.findall(r"[a-z]+", text.lower())
```

---

## 5. Concurrency primer

### 5.1 The GIL in one paragraph

CPython's Global Interpreter Lock means only one thread executes Python bytecode at a time. So:

- **CPU-bound** Python code (number crunching in pure Python) gets **no speedup** from threading — use `multiprocessing` if you need real parallelism. But that's rarely the right answer on a 90-minute coding screen.
- **I/O-bound** code (network, disk, `time.sleep`, `queue.get`) **does** benefit from threading or asyncio, because the GIL is released during the wait.

For a CodeSignal test, treat concurrency as a *correctness* problem (coordinating workers, sequencing events, producer/consumer) rather than a performance problem.

### 5.2 When to pick which

| Situation | Threading | asyncio |
|---|---|---|
| Spec uses callbacks, sleeps, blocking queues | ✓ | needs adapters |
| Spec uses `async def` / `await` | adapter pain | ✓ |
| Coordinating shared mutable state with locks | natural | natural (single-threaded, but still needs `asyncio.Lock` between awaits) |
| Mixing with blocking 3rd-party calls | natural | must use `loop.run_in_executor` |
| You want determinism + easy debugging | asyncio (cooperative) | asyncio |
| Many simultaneous "tasks" doing waits | threading scales OK; asyncio scales further | ✓ |

Default for an unfamiliar problem on the day: **threading**, because (a) it composes with blocking APIs and (b) `unittest` and `time.sleep` are blocking. Switch to **asyncio** if the spec already uses `async`/`await` or describes an event loop.

### 5.3 Hazards to remember

- **Race condition**: two threads read-modify-write the same variable without locking. Fix: a `Lock` around the critical section, or use an atomic structure (`queue.Queue`, `Counter` updates under a lock).
- **Deadlock**: thread A holds lock 1 and waits on lock 2; thread B holds lock 2 and waits on lock 1. Fix: acquire locks in a consistent global order, or use `RLock`/timeouts.
- **Lost wakeup**: signalling a condition before any thread is waiting. Fix: use `Condition` with `notify` inside the same `with cond:` block that mutates the predicate.
- **Spurious wakeup**: always re-check the predicate in a `while` loop after `cond.wait()`.
- **Forgotten lock release**: always use `with lock:`.
- **Pickling errors / not-thread-safe data**: prefer message passing (`queue.Queue`) over shared mutable state when you can.

---

## 6. Threading

### 6.1 Starting threads

```python
import threading, time

def worker(name, n):
    for i in range(n):
        print(name, i)
        time.sleep(0.01)

t = threading.Thread(target=worker, args=("A", 5), daemon=True)
t.start()
t.join(timeout=2)        # block until done or timeout
t.is_alive()
```

`daemon=True` threads are killed when the program exits; use them for background helpers.

### 6.2 `Lock` and `RLock`

```python
lock = threading.Lock()
counter = 0

def inc():
    global counter
    with lock:                # acquire / release automatically
        counter += 1          # critical section

# RLock allows the SAME thread to re-acquire (good for recursive helpers)
rlock = threading.RLock()
```

### 6.3 `Semaphore` — limit concurrent access to N

```python
sem = threading.Semaphore(3)            # at most 3 in the section at once

def use_resource():
    with sem:
        time.sleep(1)
```

`BoundedSemaphore` raises if `release()` is called more times than `acquire()`.

### 6.4 `Event` — one-shot flag

```python
ready = threading.Event()

def waiter():
    ready.wait()             # blocks until set
    print("go!")

def starter():
    time.sleep(1); ready.set()

# ready.clear() to reset
```

### 6.5 `Condition` — wait on a predicate

Used when "wait until some shared state becomes true". The condition wraps a lock; you must hold the lock to call `wait`/`notify`.

```python
cv = threading.Condition()
items = []

def producer():
    with cv:
        items.append(1)
        cv.notify()                    # wake one waiter
        # cv.notify_all() to wake everyone

def consumer():
    with cv:
        while not items:               # ALWAYS re-check in a loop
            cv.wait()
        x = items.pop(0)
```

### 6.6 `Barrier` — wait until N threads have arrived

```python
b = threading.Barrier(3)
def phase():
    do_part_one()
    b.wait()                 # all 3 sync here
    do_part_two()
```

### 6.7 `queue.Queue` — thread-safe FIFO (and the easy answer to most coordination)

```python
import queue, threading

q = queue.Queue(maxsize=10)  # 0 = unbounded

def producer():
    for x in data:
        q.put(x)             # blocks if full
    q.put(None)              # sentinel

def consumer():
    while True:
        x = q.get()          # blocks if empty
        try:
            if x is None: return
            handle(x)
        finally:
            q.task_done()    # only needed if using q.join()

q.join()                     # block until every put() has matching task_done()
```

`queue.Queue` is preferable to manual `Lock` + list whenever possible.

### 6.8 `ThreadPoolExecutor`

```python
from concurrent.futures import ThreadPoolExecutor, as_completed

def fetch(url): ...

with ThreadPoolExecutor(max_workers=8) as pool:
    futures = [pool.submit(fetch, u) for u in urls]
    for fut in as_completed(futures):
        try:
            data = fut.result(timeout=5)
        except Exception as e:
            ...

# Map (results in input order)
with ThreadPoolExecutor() as pool:
    results = list(pool.map(fetch, urls))
```

`Future`: `result()`, `exception()`, `done()`, `cancel()`, `add_done_callback(fn)`.

### 6.9 Worked: thread-safe counter with a lock

```python
import threading

class Counter:
    def __init__(self):
        self._n = 0
        self._lock = threading.Lock()
    def inc(self, by=1):
        with self._lock:
            self._n += by
    @property
    def value(self):
        with self._lock:
            return self._n
```

### 6.10 Worked: bounded blocking buffer (custom, no `queue.Queue`)

```python
import threading

class BoundedBuffer:
    def __init__(self, capacity):
        self._cap = capacity
        self._buf = []
        self._cv = threading.Condition()

    def put(self, x):
        with self._cv:
            while len(self._buf) >= self._cap:
                self._cv.wait()
            self._buf.append(x)
            self._cv.notify_all()

    def get(self):
        with self._cv:
            while not self._buf:
                self._cv.wait()
            x = self._buf.pop(0)
            self._cv.notify_all()
            return x
```

### 6.11 Worked: rate limiter (max N actions per window)

```python
import threading, time
from collections import deque

class RateLimiter:
    def __init__(self, max_calls, window_sec):
        self.max_calls = max_calls
        self.window = window_sec
        self.calls = deque()
        self.lock = threading.Lock()

    def acquire(self):
        while True:
            with self.lock:
                now = time.monotonic()
                while self.calls and now - self.calls[0] >= self.window:
                    self.calls.popleft()
                if len(self.calls) < self.max_calls:
                    self.calls.append(now)
                    return
                wait = self.window - (now - self.calls[0])
            time.sleep(wait)
```

---

## 7. asyncio

### 7.1 Mental model

- A single thread runs an **event loop**.
- Coroutines (`async def`) cooperate by **awaiting** suspension points (I/O, `asyncio.sleep`, `Queue.get`, etc.).
- Between `await`s, code runs uninterrupted — so you usually don't need locks unless an `await` sits in the middle of a critical section.

### 7.2 Basic shape

```python
import asyncio

async def fetch(name, delay):
    print(f"start {name}")
    await asyncio.sleep(delay)        # NEVER use time.sleep in asyncio code
    print(f"done {name}")
    return name

async def main():
    # Run concurrently:
    results = await asyncio.gather(
        fetch("a", 1),
        fetch("b", 2),
        fetch("c", 0.5),
    )
    return results

asyncio.run(main())                   # creates loop, runs main(), closes loop
```

`asyncio.run` is the only entry point you usually need at the top level.

### 7.3 Creating and awaiting tasks

```python
async def main():
    t1 = asyncio.create_task(fetch("a", 1))  # schedules immediately
    t2 = asyncio.create_task(fetch("b", 2))
    a, b = await t1, await t2

    # Wait with timeout
    try:
        result = await asyncio.wait_for(fetch("c", 5), timeout=2)
    except asyncio.TimeoutError:
        ...

    # Cancel
    t = asyncio.create_task(long_thing())
    t.cancel()
    try: await t
    except asyncio.CancelledError: pass
```

`asyncio.gather(*coros, return_exceptions=False)` — runs concurrently, returns list of results in input order. With `return_exceptions=True`, exceptions become return values instead of being raised.

`asyncio.wait(set_of_tasks, return_when=...)` — lower-level; returns `(done, pending)`.

### 7.4 Synchronization primitives (asyncio versions)

```python
lock = asyncio.Lock()
async with lock:
    ...

sem = asyncio.Semaphore(5)
async with sem:
    await fetch(...)

event = asyncio.Event()
await event.wait()
event.set(); event.clear()

q = asyncio.Queue(maxsize=10)
await q.put(item)
item = await q.get()
q.task_done(); await q.join()
```

These are **not interchangeable with `threading.Lock`** — use the asyncio versions inside coroutines, the threading versions inside threads.

### 7.5 Bridging blocking code

```python
import asyncio

def blocking_call(x):       # ordinary blocking function
    ...

async def main():
    loop = asyncio.get_running_loop()
    result = await loop.run_in_executor(None, blocking_call, arg)
    # or, cleaner (3.9+):
    result = await asyncio.to_thread(blocking_call, arg)
```

### 7.6 Worked: concurrent fetches with a limit

```python
import asyncio

async def fetch(sess, url): ...

async def fetch_all(urls, max_concurrent=10):
    sem = asyncio.Semaphore(max_concurrent)
    async def bound(url):
        async with sem:
            return await fetch(sess, url)
    return await asyncio.gather(*(bound(u) for u in urls))
```

### 7.7 Worked: async producer / consumer

```python
import asyncio

async def producer(q, items):
    for x in items:
        await q.put(x)
    await q.put(None)               # sentinel

async def consumer(q, out):
    while True:
        x = await q.get()
        try:
            if x is None: return
            out.append(x * 2)
        finally:
            q.task_done()

async def main():
    q = asyncio.Queue()
    out = []
    await asyncio.gather(
        producer(q, range(5)),
        consumer(q, out),
    )
    return out
```

### 7.8 Pitfalls

- **`time.sleep` in a coroutine** blocks the entire event loop. Use `await asyncio.sleep`.
- **Forgetting to `await`** a coroutine returns a coroutine *object* and a `RuntimeWarning: coroutine was never awaited`. Lint catches it; tests will fail.
- **Mixing `asyncio.Lock` and `threading.Lock`** — never do this.
- **`asyncio.run` inside an already-running loop** raises. In tests, use the loop the test runner gave you.

---

## 8. Threading vs asyncio — same problem, both ways

### 8.1 Bounded producer / consumer

**Threading:**

```python
import threading, queue

def producer(q, items):
    for x in items: q.put(x)
    q.put(None)

def consumer(q, out):
    while True:
        x = q.get()
        try:
            if x is None: return
            out.append(x * 2)
        finally:
            q.task_done()

def run(items):
    q = queue.Queue(maxsize=5)
    out = []
    t1 = threading.Thread(target=producer, args=(q, items))
    t2 = threading.Thread(target=consumer, args=(q, out))
    t1.start(); t2.start()
    t1.join(); t2.join()
    return out
```

**asyncio:**

```python
import asyncio

async def producer(q, items):
    for x in items: await q.put(x)
    await q.put(None)

async def consumer(q, out):
    while True:
        x = await q.get()
        try:
            if x is None: return
            out.append(x * 2)
        finally:
            q.task_done()

async def run(items):
    q = asyncio.Queue(maxsize=5)
    out = []
    await asyncio.gather(producer(q, items), consumer(q, out))
    return out
```

### 8.2 Per-key serial executor (run tasks tagged with same key in order, different keys in parallel)

**Threading:** one worker thread per key, each pulling from its own queue.

```python
import threading, queue
from collections import defaultdict

class KeyedExecutor:
    def __init__(self):
        self._queues = {}
        self._threads = {}
        self._lock = threading.Lock()

    def submit(self, key, fn, *args):
        with self._lock:
            if key not in self._queues:
                q = queue.Queue()
                self._queues[key] = q
                t = threading.Thread(target=self._worker, args=(q,), daemon=True)
                self._threads[key] = t
                t.start()
        self._queues[key].put((fn, args))

    def _worker(self, q):
        while True:
            fn, args = q.get()
            try: fn(*args)
            finally: q.task_done()

    def join(self):
        for q in list(self._queues.values()):
            q.join()
```

**asyncio:** one task per key, each pulling from its own queue.

```python
import asyncio

class KeyedExecutor:
    def __init__(self):
        self._queues = {}
        self._tasks = {}

    def submit(self, key, coro_fn, *args):
        if key not in self._queues:
            self._queues[key] = asyncio.Queue()
            self._tasks[key] = asyncio.create_task(self._worker(self._queues[key]))
        self._queues[key].put_nowait((coro_fn, args))

    async def _worker(self, q):
        while True:
            coro_fn, args = await q.get()
            try: await coro_fn(*args)
            finally: q.task_done()

    async def join(self):
        await asyncio.gather(*(q.join() for q in self._queues.values()))
```

### 8.3 Rate limiter (sliding window, max N per second)

**Threading:** see §6.11.

**asyncio:**

```python
import asyncio, time
from collections import deque

class AsyncRateLimiter:
    def __init__(self, max_calls, window):
        self.max_calls, self.window = max_calls, window
        self.calls = deque()
        self.lock = asyncio.Lock()

    async def acquire(self):
        while True:
            async with self.lock:
                now = time.monotonic()
                while self.calls and now - self.calls[0] >= self.window:
                    self.calls.popleft()
                if len(self.calls) < self.max_calls:
                    self.calls.append(now)
                    return
                wait = self.window - (now - self.calls[0])
            await asyncio.sleep(wait)
```

---

## 9. `unittest`

### 9.1 Anatomy of a test

```python
import unittest

class TestThing(unittest.TestCase):
    @classmethod
    def setUpClass(cls):     # once per class
        cls.heavy = make_fixture()

    def setUp(self):         # before every test
        self.thing = Thing()

    def tearDown(self):      # after every test (even if it failed)
        self.thing.close()

    def test_basic(self):
        self.assertEqual(self.thing.add(2, 3), 5)

    def test_raises(self):
        with self.assertRaises(ValueError):
            self.thing.parse("bad")

if __name__ == "__main__":
    unittest.main()
```

### 9.2 Common assertions

```python
self.assertEqual(a, b)
self.assertNotEqual(a, b)
self.assertTrue(x); self.assertFalse(x)
self.assertIs(a, b); self.assertIsNone(x); self.assertIsNotNone(x)
self.assertIn(x, container); self.assertNotIn(x, container)
self.assertIsInstance(obj, cls)
self.assertAlmostEqual(a, b, places=7)             # for floats
self.assertGreater(a, b); self.assertLess(a, b)
self.assertListEqual(a, b)                          # better diff for lists
self.assertDictEqual(a, b)
with self.assertRaises(ExceptionType):
    f()
with self.assertRaisesRegex(ValueError, r"bad .*"):
    f()
```

### 9.3 Subtests (parametrize without external libs)

```python
def test_table(self):
    for x, expected in [(0, 0), (1, 1), (2, 4), (3, 9)]:
        with self.subTest(x=x):
            self.assertEqual(square(x), expected)
```

### 9.4 Skipping / expected failures

```python
@unittest.skip("not yet implemented")
def test_a(self): ...

@unittest.skipIf(sys.platform == "win32", "POSIX only")
def test_b(self): ...

@unittest.expectedFailure
def test_known_bug(self): ...
```

### 9.5 Async tests (3.8+)

```python
class TestAsync(unittest.IsolatedAsyncioTestCase):
    async def test_it(self):
        result = await my_coro()
        self.assertEqual(result, 42)
```

### 9.6 Running

```
python -m unittest                       # discover & run
python -m unittest tests.test_foo        # specific module
python -m unittest tests.test_foo.TestX.test_y
python -m unittest -v                    # verbose
python -m unittest -f                    # stop on first failure
```

### 9.7 Reading a failure fast

```
FAIL: test_count (tests.test_x.TestX.test_count)
----------------------------------------------------------------------
Traceback (most recent call last):
  File ".../tests/test_x.py", line 42, in test_count
    self.assertEqual(thing.count(), 3)
AssertionError: 2 != 3
```

Workflow: copy the test ID, run only that one (`python -m unittest tests.test_x.TestX.test_count`), iterate.

---

## 10. LeetCode-style patterns

### 10.1 Hashmap counting / lookup

**Two sum:**

```python
def two_sum(nums, target):
    seen = {}                                 # value -> index
    for i, x in enumerate(nums):
        need = target - x
        if need in seen:
            return [seen[need], i]
        seen[x] = i
    return [-1, -1]
```

### 10.2 Two pointers

**Remove duplicates from sorted array (in place), return new length:**

```python
def dedup(nums):
    if not nums: return 0
    w = 1
    for r in range(1, len(nums)):
        if nums[r] != nums[r-1]:
            nums[w] = nums[r]; w += 1
    return w
```

### 10.3 Sliding window

**Longest substring with at most K distinct characters:**

```python
from collections import defaultdict
def longest_k_distinct(s, k):
    counts = defaultdict(int); lo = best = 0
    for hi, ch in enumerate(s):
        counts[ch] += 1
        while len(counts) > k:
            counts[s[lo]] -= 1
            if counts[s[lo]] == 0: del counts[s[lo]]
            lo += 1
        best = max(best, hi - lo + 1)
    return best
```

### 10.4 BFS / DFS on grids and graphs

**Grid BFS (shortest path through 0s, 4-connected):**

```python
from collections import deque
def shortest(grid, start, goal):
    R, C = len(grid), len(grid[0])
    q = deque([(start, 0)])
    seen = {start}
    while q:
        (r, c), d = q.popleft()
        if (r, c) == goal: return d
        for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
            nr, nc = r+dr, c+dc
            if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] == 0 and (nr,nc) not in seen:
                seen.add((nr,nc))
                q.append(((nr,nc), d+1))
    return -1
```

**Recursive DFS with visited set:**

```python
def dfs(graph, start):
    seen = set(); order = []
    def go(u):
        if u in seen: return
        seen.add(u); order.append(u)
        for v in graph[u]: go(v)
    go(start)
    return order
```

**Iterative DFS:**

```python
def dfs_iter(graph, start):
    seen = set([start]); stack = [start]; order = []
    while stack:
        u = stack.pop()
        order.append(u)
        for v in graph[u]:
            if v not in seen:
                seen.add(v); stack.append(v)
    return order
```

### 10.5 Heap (k-smallest, scheduling)

**Merge K sorted lists:**

```python
import heapq
def merge_k(lists):
    h = []
    for i, lst in enumerate(lists):
        if lst: heapq.heappush(h, (lst[0], i, 0))
    out = []
    while h:
        val, i, j = heapq.heappop(h)
        out.append(val)
        if j + 1 < len(lists[i]):
            heapq.heappush(h, (lists[i][j+1], i, j+1))
    return out
```

### 10.6 Prefix sum / running aggregate

**Subarray sum equals K:**

```python
from collections import defaultdict
def subarray_sum(nums, k):
    counts = defaultdict(int); counts[0] = 1
    total = running = 0
    for x in nums:
        running += x
        total += counts[running - k]
        counts[running] += 1
    return total
```

### 10.7 Interval problems

**Merge intervals:**

```python
def merge(intervals):
    intervals.sort(key=lambda p: p[0])
    out = []
    for s, e in intervals:
        if out and s <= out[-1][1]:
            out[-1][1] = max(out[-1][1], e)
        else:
            out.append([s, e])
    return out
```

### 10.8 Binary search (use `bisect`)

```python
import bisect
i = bisect.bisect_left(sorted_xs, target)   # leftmost insertion point
j = bisect.bisect_right(sorted_xs, target)  # rightmost insertion point
# target present iff i < len and sorted_xs[i] == target
# count of target = j - i

bisect.insort(sorted_xs, x)                 # insert preserving order
```

### 10.9 Backtracking template

```python
def permutations(nums):
    res = []
    def backtrack(path, remaining):
        if not remaining:
            res.append(path[:]); return
        for i, x in enumerate(remaining):
            path.append(x)
            backtrack(path, remaining[:i] + remaining[i+1:])
            path.pop()
    backtrack([], nums)
    return res
```

### 10.10 DP (memoize first, then tabulate if needed)

```python
from functools import lru_cache

def coin_change(coins, amount):
    @lru_cache(maxsize=None)
    def best(amt):
        if amt == 0: return 0
        if amt < 0: return float("inf")
        return min((best(amt - c) for c in coins), default=float("inf")) + 1
    ans = best(amount)
    return ans if ans != float("inf") else -1
```

Or bottom-up:

```python
def coin_change(coins, amount):
    INF = amount + 1
    dp = [0] + [INF] * amount
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a:
                dp[a] = min(dp[a], dp[a - c] + 1)
    return dp[amount] if dp[amount] != INF else -1
```

---

## 11. CodeSignal test-taking strategy

**Before you start coding (~5 min):**

1. **Read all 6 level descriptions first** if possible — later levels usually extend earlier ones. Knowing what's coming shapes how you design level 1.
2. **Skim the test file**. The tests are the spec; the prose can be ambiguous.
3. Decide threading vs asyncio based on the test file imports / shape (does it use `async def`? does it use `time.sleep` or `asyncio.sleep`?).

**As you work each level:**

- **Run the tests early and often.** First action after writing any code: run.
- **Don't over-engineer.** No abstractions for "future flexibility" — the next level will tell you exactly what to add.
- **Don't fight edge cases the tests don't check.** The invite says explicitly: *"Don't worry about edge cases if there are no tests checking them."*
- **Optimize only when the spec demands it.** Otherwise the simplest correct solution wins.
- **Use Python built-ins aggressively** — `Counter`, `defaultdict`, `deque`, `heapq`, `bisect`, `itertools`.

**Time budgeting (90 min, 6 levels):**

- Roughly 15 min/level average, but levels 1-2 should be much faster (5-10 min each), buying time for 4-6.
- **Finishing early is a bonus.** Don't sandbag.
- If stuck on a level, **commit the partial solution that passes some tests**, then move on. Tests are independent across levels in CodeSignal-style tasks; you usually still get credit for what passes.

**Debugging under time pressure:**

- Read the failing assertion. Read the assertion's expected and actual values literally.
- Re-read the test code that builds the input — don't assume.
- Add `print(...)` liberally and check the test runner output. Remove before final submission only if it interferes.
- If a concurrency test is flaky, your code has a race. Add a lock or serialize through a queue rather than chasing it with sleeps.

**Concurrency-specific:**

- Prefer `queue.Queue` / `asyncio.Queue` over manual locking when you can.
- Whenever you write `cond.wait()`, wrap it in `while not predicate:`.
- Whenever you `await something_that_could_be_cancelled()`, think about whether `CancelledError` should propagate (almost always: yes).
- For threads, `daemon=True` if you don't want them to keep the process alive.

**Last 5 minutes:**

- Re-run the full suite.
- Make sure no dead imports or stray prints break test parsing.
- Submit.

Good luck.
