# NEC BCT Licensure Exam — Question Bank, Solutions & Key Concepts

Multiple-choice questions from the **Nepal Engineering Council (NEC) Licensure Examination** for **Bachelor of Computer Engineering (BCT)** — organised into three sets:

- **Set I** — Section A (60) + Section B (20)
- **Set II** — Section A (60) + Section B (20)
- **Set III** — Section A (60) + Section B (20)

Each question lists the options, the correct answer, and a short **key-concept** note so you can recover the answer from first principles rather than memorisation.

---

## Set I

### Set I · Section A (60 × 1 = 60)

#### Q1. Which type of contract is not a "cost plus" contract?
- a) Cost plus fixed fee · b) Cost plus incentive fee · c) Cost and fixed assets · d) Cost plus percentage of cost
- **Answer:** c) Cost and fixed assets
- **Key concept:** Cost-plus contracts reimburse the contractor's actual cost plus an additional payment. Three valid forms: *fixed fee*, *incentive fee*, *percentage of cost*. "Cost and fixed assets" is not a standard contract type.

#### Q2. In which year was the first expert system developed?
- a) 1960 · b) 1965 · c) 1970 · d) 1975
- **Answer:** b) 1965
- **Key concept:** *DENDRAL* (1965, Stanford) is regarded as the first expert system — a rule-based AI for identifying chemical compounds.

#### Q3. What is the correct symbol for first-angle projection?
- a) ⊥ · b) ∠ · c) ⊿ · d) ⊤
- **Answer:** a)
- **Key concept:** In engineering drawing, *first-angle projection* (ISO/European convention) places the object in the first quadrant; its symbol is a truncated cone with the small circle behind.

#### Q4. What is another name for a simple SR flip-flop?
- a) Monostable multivibrator · b) Bistable multivibrator · c) Astable multivibrator · d) Schmitt trigger
- **Answer:** b) Bistable multivibrator
- **Key concept:** Flip-flops have **two stable states** → bistable. Astable = oscillator, monostable = one-shot.

#### Q5. What is an alternative name for pipelining?
- a) Assembly line operation · b) Parallel processing · c) Sequential execution · d) Batch processing
- **Answer:** a) Assembly line operation
- **Key concept:** A CPU pipeline overlaps instruction stages (fetch–decode–execute–writeback) like stations on an assembly line.

#### Q6. How many interrupts are there in the 8085 microprocessor?
- a) 5 · b) 8 · c) 10 · d) 13
- **Answer:** d) 13 (5 hardware vectored + 8 software RST0–RST7)
- **Key concept:** Hardware: TRAP, RST 7.5, RST 6.5, RST 5.5, INTR. Software: RST 0–RST 7. Total = 13.

#### Q7. Which of the following is **not** a non-maskable interrupt?
- a) TRAP · b) RST 7.5 · c) RST 6.5 · d) RST 5.5
- **Answer:** a) TRAP *(question phrasing inverted — TRAP is the only non-maskable; RST 7.5/6.5/5.5 are maskable)*
- **Key concept:** In 8085 only **TRAP** is non-maskable. The others can be masked using `SIM`.

#### Q8. What is the relationship between terminal voltage and emf?
- a) V = emf · b) V > emf · c) V < emf · d) No relation
- **Answer:** c) Terminal voltage is less than emf (V = emf − I·r when supplying current)
- **Key concept:** Internal resistance `r` causes drop `Ir`; so `V_terminal = E − Ir` for a discharging source.

#### Q9. If a delta connection has 3 Ω per phase, what is the equivalent star-connection resistance?
- a) 1 Ω · b) 3 Ω · c) 9 Ω · d) 27 Ω
- **Answer:** a) 1 Ω
- **Key concept:** Δ→Y transform: `R_Y = R_Δ / 3` for balanced loads.

#### Q10. What type of learning algorithm is Naive Bayes?
- a) Unsupervised · b) Supervised · c) Reinforcement · d) Semi-supervised
- **Answer:** b) Supervised
- **Key concept:** Naive Bayes is a probabilistic classifier trained on labelled data using Bayes' theorem with feature-independence assumption.

#### Q11. Input and output types for a 4-to-16 decoder?
- a) Binary→decimal · b) Binary→hex · c) Hex→binary · d) Decimal→binary
- **Answer:** b) Binary input → hexadecimal output
- **Key concept:** 4 input lines = 2⁴ = 16 outputs; output line index corresponds to a hex digit (0–F).

#### Q12. Which logic gate is the building block of an encoder?
- a) AND · b) OR · c) NOT · d) XOR
- **Answer:** b) OR
- **Key concept:** Encoders collapse 2ⁿ active-low/high lines onto n outputs — each output line is the OR of all inputs that should set that bit.

#### Q13. Given `int *p, u; float *y, x;` which is the correct next line?
- a) `p = &u` · b) `p = u` · c) `y = &x` · d) `y = x`
- **Answer:** a) `p = &u` (and also c — but the official answer is a)
- **Key concept:** A pointer of type `T*` must hold the address (`&`) of a `T`. `p = u` would assign an int to a pointer (type mismatch).

#### Q14. Which of the following is **not** a format specifier in C?
- a) `%d` · b) `%f` · c) `%s` · d) `%t`
- **Answer:** d) `%t`
- **Key concept:** Standard specifiers: `%d %i %u %f %lf %s %c %x %o %p %e %g`. There is no `%t`.

#### Q15. In project management, what comes after the project idea in product design?
- a) Development · b) Testing · c) Implementation · d) Design
- **Answer:** d) Design
- **Key concept:** Product-design lifecycle: *Idea → Design → Development → Testing → Implementation/Launch*.

#### Q16. Which of the following is a stable filter?
- a) RC filter · b) LC filter · c) Crystal oscillator · d) Op-amp filter
- **Answer:** c) Crystal oscillator
- **Key concept:** A piezoelectric crystal provides extremely high Q and frequency stability (drift ≪ 1 ppm) compared to RC/LC tanks.

#### Q17. How is frequency defined in AC?
- a) Number of waves per second · b) Time period · c) Amplitude · d) Phase difference
- **Answer:** a) Number of cycles per second (Hz)
- **Key concept:** `f = 1/T`. Period and amplitude are different quantities.

#### Q18. Who appoints the auditor of NEC?
- a) NEC Executives · b) Shareholders · c) CEO · d) Government
- **Answer:** a) NEC Executives (council)
- **Key concept:** Per the Nepal Engineering Council Act, the council appoints its own auditor (with government approval mechanisms in some clauses).

#### Q19. Which OSI layer is responsible for binary transmission?
- a) Data Link · b) Network · c) Physical · d) Transport
- **Answer:** c) Physical layer
- **Key concept:** Layer 1 transmits raw bits over the medium (voltage, light pulses, radio).

#### Q20. What type of grammar is a PDA (Pushdown Automaton) associated with?
- a) Type 0 · b) Type 1 · c) Type 2 · d) Type 3
- **Answer:** c) Type 2 (Context-Free)
- **Key concept:** Chomsky hierarchy: Type 0 → Turing Machine, Type 1 → LBA, Type 2 → PDA, Type 3 → FA.

#### Q21. Key characteristic of a Universal Turing Machine?
- a) Programmable · b) Fixed function · c) Analog · d) Quantum
- **Answer:** a) Programmable
- **Key concept:** A UTM can simulate any other TM whose description is supplied as input — it is *the* model of a stored-program computer.

#### Q22. Which test determines machine intelligence?
- a) Turing test · b) IQ test · c) A/B test · d) Unit test
- **Answer:** a) Turing test
- **Key concept:** Proposed by Alan Turing (1950) — an evaluator can't reliably tell machine from human via text.

#### Q23. What component primarily uses BIOS?
- a) CPU · b) RAM · c) Hard Drive · d) Operating system
- **Answer:** d) Operating system
- **Key concept:** BIOS initialises hardware and hands control to the OS bootloader.

#### Q24. Real-time operation depends on which two factors?
- a) Speed and accuracy · b) Time and memory · c) Input/output · d) Hardware/software
- **Answer:** a) Speed and accuracy
- **Key concept:** Real-time systems must produce correct results within a deterministic deadline — both temporal and logical correctness matter.

#### Q25. What does distance-vector routing depend on?
- a) Hop counts · b) Bandwidth · c) Latency · d) IP addresses
- **Answer:** a) Hop counts
- **Key concept:** RIP-style DV protocols share `(destination, hop-count)` tables and use Bellman-Ford updates.

#### Q26. What causes propagation delay?
- a) Congestion · b) Router processing · c) Distance between routers · d) Packet size
- **Answer:** c) Distance between routers (physical propagation)
- **Key concept:** `t_prop = distance / signal speed`. Independent of packet size (that's *transmission delay*).

#### Q27. Maximum nodes in a binary tree of height h?
- a) 2^h · b) 2^h − 1 · c) 2^(h+1) − 1 · d) 2^(h-1)
- **Answer:** c) 2^(h+1) − 1 *(convention: root at height 0)*. The paper marks b) 2^h − 1, valid if root counted at height 1.
- **Key concept:** Sum of 2⁰ + 2¹ + … + 2^h = 2^(h+1) − 1 nodes at depth-counting from 0.

#### Q28. What is a requirement of a binary search tree?
- a) Balanced · b) Complete · c) Sorted · d) Each node has ≥ 1 child
- **Answer:** c) Must be sorted (left < root < right)
- **Key concept:** BST invariant is the ordering property, not balance or completeness.

#### Q29. Which transformation resizes an object?
- a) Translation · b) Rotation · c) Scaling · d) Shearing
- **Answer:** c) Scaling
- **Key concept:** Scaling multiplies coordinates by sx, sy (sz) — translation moves, rotation pivots, shearing skews.

#### Q30. Which process runs after the Kernel bootstrap is executed?
- a) `/sbin/init` · b) `/etc/init.d` · c) `/boot/grub` · d) `/proc/kmsg`
- **Answer:** a) `/sbin/init` (PID 1) — historically; on the paper it's marked b).
- **Key concept:** After kernel hand-off, PID 1 (`init`, `systemd`, or BusyBox) starts; `/etc/init.d` is where SysV init scripts live.

#### Q31. What is an encrypted message called?
- a) Plaintext · b) Ciphertext · c) Keytext · d) Hashtext
- **Answer:** b) Ciphertext
- **Key concept:** Encryption: plaintext + key → ciphertext. Decryption reverses.

#### Q32. Function of the application layer in networking?
- a) Data transmission · b) Routing · c) User-to-system application · d) Error checking
- **Answer:** c) Provides interface between user apps and network services
- **Key concept:** OSI L7 hosts HTTP, FTP, SMTP, DNS — the "user-visible" services.

#### Q33. On which plane does 2D rotation occur?
- a) 3D · b) 2D · c) XY · d) XZ
- **Answer:** b) 2D plane (XY)
- **Key concept:** 2D rotations act on the XY plane about the origin (or about a pivot).

#### Q34. Which statement about functions/templates is incorrect?
- a) Overloaded functions can be redefined · b) Templates can be redefined · c) Macros are more efficient than templates · d) All are correct
- **Answer:** d) All statements are correct *(stated answer; in practice macros aren't strictly "more efficient")*
- **Key concept:** Templates are type-safe; macros are textual substitution. Macros may be marginally faster at compile-time but lose type safety.

#### Q35. Which interrupt has the highest priority in 8086?
- a) INTR · b) NMI · c) INT 0 · d) INT 3
- **Answer:** b) NMI (Non-Maskable Interrupt)
- **Key concept:** Priority order: divide-error > single-step > NMI > INT n > INTR. NMI > INTR (maskable).

#### Q36. How many 16-bit registers in the 8085?
- a) 1 · b) 2 · c) 3 · d) 4
- **Answer:** c) 3 (SP, PC, plus the register-pair view)
- **Key concept:** True 16-bit: SP (Stack Pointer), PC (Program Counter); the paper accepts 2 / 3 depending on whether the *internal* 16-bit pair register is counted.

#### Q37. Purpose of a Wait-for graph?
- a) Process scheduling · b) Memory allocation · c) Deadlock detection · d) File management
- **Answer:** c) Deadlock detection
- **Key concept:** Nodes = processes, edges P→Q mean "P waits for Q." A cycle ⇒ deadlock.

#### Q38. Primary purpose of a special processor?
- a) General computation · b) Special function · c) Data storage · d) Network comm.
- **Answer:** b) Performs a specific function (GPU, DSP, NPU, etc.)
- **Key concept:** Specialised processors trade generality for performance/efficiency in their target workload.

#### Q39. Term for excessive network load?
- a) Overload · b) Congestion · c) Saturation · d) Bottleneck
- **Answer:** b) Congestion
- **Key concept:** When offered load > link capacity, queues grow → packet loss and delay (congestion).

#### Q40. Key feature of a bus in computer architecture?
- a) Data transfer · b) Priority handling · c) Memory access · d) Interrupt handling
- **Answer:** b) Priority handling (arbitration); some sources mark *data transfer*
- **Key concept:** Multi-master buses use arbitration to grant access; the *primary* purpose is shared data transfer with arbitration for priority.

#### Q41. Which is **not** a combinational circuit?
- a) Multiplexer · b) Decoder · c) Adder · d) Counter
- **Answer:** d) Counter (sequential — has state)
- **Key concept:** Combinational outputs depend only on current inputs; sequential circuits include memory (flip-flops).

#### Q42. How many categories of memory storage are there?
- a) 2 · b) 3 · c) 1 · d) 5
- **Answer:** a) 2 — **primary** (volatile RAM, cache) and **secondary** (non-volatile disk, SSD, tape)
- **Key concept:** Classical taxonomy is primary/secondary; tertiary (archival) is sometimes added.

#### Q43. Term for multiple processes executing concurrently in a single-user system?
- a) Multiprocessing · b) Multitasking · c) Multithreading · d) Time-sharing
- **Answer:** b) Multitasking
- **Key concept:** Single user with several processes time-sliced → multitasking. Multiprocessing = multiple CPUs.

#### Q44. Which configuration option does PPP have?
- a) Encryption · b) Compression · c) Authentication · d) Multiplexing
- **Answer:** c) Authentication (PAP, CHAP)
- **Key concept:** PPP authentication phase negotiates PAP or CHAP after LCP link-establishment.

#### Q45. How many articles are in the NEC code of conduct?
- a) 5 · b) 8 · c) 10 · d) 12
- **Answer:** b) 8 articles
- **Key concept:** Nepal Engineering Council's professional code of conduct has 8 articles covering integrity, competence, public safety, etc.

#### Q46. Key function of CMOS technology?
- a) High speed · b) Low power consumption · c) High storage · d) High heat
- **Answer:** b) Low power consumption
- **Key concept:** CMOS draws current only during transitions ⇒ very low static power.

#### Q47. What is single-level inheritance?
- a) From multiple base classes · b) From a single base class · c) Base inherited from multiple derived · d) Cannot be inherited
- **Answer:** b) A class inherited from one base class
- **Key concept:** Inheritance taxonomy: single, multiple, multilevel, hierarchical, hybrid.

#### Q48. Software model representing behaviour and interaction?
- a) Class diagram · b) Sequence diagram · c) Use case · d) Activity diagram
- **Answer:** c) Use case (behaviour + actor interaction)
- **Key concept:** Use-case diagrams capture *what* a user can do; sequence diagrams show *how* over time.

#### Q49. Which SDLC model prominently features risk management?
- a) Agile · b) Iterative · c) Spiral · d) Waterfall
- **Answer:** c) Spiral model (Boehm)
- **Key concept:** Each spiral cycle: objectives → risk analysis → development → planning. Risk is a first-class activity.

#### Q50. Which SDLC model is difficult to maintain?
- a) Agile · b) Iterative · c) Spiral · d) Waterfall
- **Answer:** d) Waterfall
- **Key concept:** Waterfall freezes requirements early; changes after release are costly.

#### Q51. Image format that uses a map of bits?
- a) Vector · b) Bitmap · c) JPEG · d) GIF
- **Answer:** b) Bitmap
- **Key concept:** Raster/bitmap stores pixel grid; vector stores shape primitives.

#### Q52. Technique used to check if a language is regular?
- a) Turing test · b) Pumping lemma · c) Halting problem · d) Church-Turing thesis
- **Answer:** b) Pumping lemma (for regular languages)
- **Key concept:** If a language is regular, every long-enough string can be "pumped." Contradiction proves non-regularity.

#### Q53. C function for current position in a file?
- a) `fseek()` · b) `ftell()` · c) `fgetpos()` · d) `rewind()`
- **Answer:** b) `ftell()` (returns long offset)
- **Key concept:** `fseek` moves; `ftell` reports; `fgetpos`/`fsetpos` use opaque `fpos_t`.

#### Q54. SQL command that removes content without altering table structure?
- a) DROP · b) TRUNCATE · c) DELETE · d) REMOVE
- **Answer:** b) TRUNCATE *(paper marks DELETE; both remove rows but TRUNCATE is the typical "wipe quickly" answer)*
- **Key concept:** DROP removes the table; TRUNCATE removes all rows (no WHERE, no logging); DELETE removes rows row-by-row.

#### Q55. Software Quality Management consists of?
- a) SQA + SQC · b) SQA + SQM · c) SQM + SQC · d) SQP + SQA
- **Answer:** a) SQA (Assurance) + SQC (Control)
- **Key concept:** SQA = process-oriented; SQC = product-oriented testing/inspection.

#### Q56. In a project network diagram, what is a dummy activity?
- a) Critical · b) Non-critical · c) Theoretical/logical · d) Resource-intensive
- **Answer:** c) Theoretical/logical (zero duration, shows dependency only)
- **Key concept:** Dummy arrows in AOA networks enforce precedence without consuming time/resources.

#### Q57. Limitation of Artificial Neural Networks?
- a) Cannot learn · b) Cannot handle complex problems · c) Cannot explain results · d) Cannot be trained
- **Answer:** c) Cannot explain results (black-box problem)
- **Key concept:** Lack of interpretability motivates explainable-AI research (LIME, SHAP, attribution).

#### Q58. Which is **not** a physical input device?
- a) Keyboard · b) Mouse · c) Touch panel · d) Microphone
- **Answer:** c) Touch panel *(borderline — paper's listed answer; all four are physical input. The intended distinction is that a touch panel is an input + display, not a discrete device.)*
- **Key concept:** Input device taxonomy is fuzzy; touch panels are simultaneously input + output (overlay on display).

#### Q59. Which is **not** a property of knowledge representation?
- a) Representational adequacy · b) Inferential adequacy · c) Inferential efficiency · d) Representational verification
- **Answer:** d) Representational verification
- **Key concept:** Standard four properties: representational adequacy, inferential adequacy, inferential efficiency, **acquisitional** efficiency.

#### Q60. Which is considered an essential implicant in Boolean algebra?
- a) Prime implicant · b) Essential prime implicant · c) Complement
- **Answer:** b) Essential prime implicant
- **Key concept:** A prime implicant becomes *essential* when it is the only prime implicant covering some minterm.

---

### Set I · Section B (20 × 2 = 40)

#### B1. What ML tasks are speech recognition and movie-rating prediction?
- a) Classification + regression · b) Regression + classification · c) Clustering + regression · d) Classification + clustering
- **Answer:** a) Classification (speech → word labels) + regression (rating → continuous value)
- **Key concept:** Discrete output → classification; continuous output → regression.

#### B2. C++ virtual dispatch — `A* ptr = new B(); ptr->display();` where both define `display()`
- Output: `B`
- **Key concept:** Virtual function + base pointer = runtime polymorphism; the most-derived override is called.

#### B3. Find current I when v = 12 V, v₁ = 20 V (circuit with 10 Ω, 2 Ω resistors)
- **Answer:** I = 6 A
- **Key concept:** Use KCL: i₅ = i₁₀ + i₂; i₁₀ = v₁/10 = 2 A. From `v = v₁ − 2·i₂` → i₂ = 4 A → I = 6 A.

#### B4. Production rules S→aSb|ε and R→cRd|ε — how many rules start with different alphabets in S ∪ R?
- **Answer:** 2 (`a` and `c`)
- **Key concept:** Look at the first terminal of each production; ε is empty so doesn't count.

#### B5. Correct precedence for logical operators?
- a) Negation, AND, OR, Implication, Bidirectional · b) AND, Neg, OR, Imp, Bi · c) OR, AND, NEG, Imp, Bi · d) Bi, AND, OR, Imp, Neg
- **Answer:** a) ¬, ∧, ∨, →, ↔
- **Key concept:** Standard precedence: NOT (highest) > AND > OR > IMPLIES > IFF (lowest).

#### B6. In a half-adder, which gate represents the carry?
- a) OR · b) AND · c) NAND · d) NOT
- **Answer:** b) AND
- **Key concept:** Sum = A ⊕ B, Carry = A · B.

#### B7. Demand paging: page-fault service = 1000 ms, memory access = 10 ms, page-fault rate = 0.01. Effective access time?
- a) 12.9 · b) 20.9 · c) 19.9 · d) 0.01
- **Answer:** c) 19.9 ms
- **Key concept:** EAT = (1 − p)·access + p·page-fault = 0.99·10 + 0.01·1000 = 9.9 + 10 = 19.9 ms.

#### B8. Equipment $10,000, life 5 years, no salvage. Annual depreciation %?
- a) 9% · b) 15% · c) 10% · d) 20%
- **Answer:** d) 20%
- **Key concept:** Straight-line: 1/n = 1/5 = 20%/year.

#### B9. `fwrite(str, strlen(str)+1, 1, filePointer)` — what does it do?
- **Answer:** a) Writes all string characters including the null terminator
- **Key concept:** `strlen(str)` is bytes excluding `\0`; the `+1` covers the null byte.

#### B10. What do building codes and bylaws primarily represent?
- **Answer:** a) Design standards
- **Key concept:** Codes/bylaws define minimum acceptable standards for design, materials, safety, and procedures.

#### B11. 4 M-bit chip, 19 external connectors, 8 data lines. Address lines?
- a) 8 · b) 16 · c) 19 · d) 20
- **Answer:** a) 8
- **Key concept:** Address bits visible externally = 19 − 8(data) − control. With 4M bits = 2²² internal cells but multiplexed addressing reduces external lines.

#### B12. 64 mod 23?
- **Answer:** a) 18
- **Key concept:** 64 = 2·23 + 18.

#### B13. Class B amplifier — adding emitter capacitance, what happens to voltage gain and impedance?
- **Answer:** a) Both voltage gain and impedance increase
- **Key concept:** Bypass capacitor short-circuits emitter resistor at signal frequency, raising gain (Av = -Rc/re′ instead of -Rc/(re+Re)) and altering input impedance.

#### B14. Preorder 30,20,10,15,25,23,39,35,42 → which is last in postorder?
- **Answer:** d) 30 (root visited last in postorder)
- **Key concept:** In postorder traversal of a BST, the root is always last.

#### B15. Q-point of a positively-biased BJT typically lies in which region?
- a) Saturation · b) Active · c) Cut-off · d) Centre
- **Answer:** d) Centre of the active region (for linear/Class-A operation)
- **Key concept:** Designers bias Q-point at the midpoint of the load line for maximum undistorted swing.

#### B16. Three main phases of OO development?
- **Answer:** b) OO Analysis (OOA), OO Design (OOD), OO Programming (OOP)
- **Key concept:** Standard Booch/Rumbaugh process: OOA → OOD → OOP.

#### B17. Key components of an AI search problem?
- **Answer:** b) Initial state, successor function, goal path/test, [optionally path cost]
- **Key concept:** Formal search problem = ⟨States, Initial, Actions/Successor, GoalTest, PathCost⟩.

#### B18. Default access specifier for data members in a C++ class?
- **Answer:** c) Private
- **Key concept:** `class` defaults to `private`; `struct` defaults to `public`.

#### B19. OOP concept allowing objects of different classes to be treated as a common base type?
- **Answer:** c) Polymorphism
- **Key concept:** Subtype polymorphism via base pointers / virtual dispatch.

#### B20. Which is **not** a property of knowledge representation?
- **Answer:** a) Representational verification
- **Key concept:** (Same as Q59) — the four canonical properties are representational adequacy, inferential adequacy, inferential efficiency, acquisitional efficiency.

---

## Set II

### Set II · Section A (60 × 1)

#### Q1. Formula for no-load voltage gain in CE configuration?
- **Answer:** b) `Av = -β·Rc/re`
- **Key concept:** CE amplifier inverts the signal (hence the minus); gain ≈ -gm·Rc = -β·Rc/rπ ≈ -β·Rc/re for an ideal BJT.

#### Q2. Types of perspective projection?
- **Answer:** c) One-, two-, and three-point perspective
- **Key concept:** Counts vanishing points: 1 (frontal box), 2 (corner view), 3 (looking up/down).

#### Q3. In a semaphore problem "18P, xV…" represents?
- **Answer:** b) 18 wait (P) operations, x signal (V) operations
- **Key concept:** Dijkstra: P (proberen) = down/wait; V (verhogen) = up/signal.

#### Q4. Latest amendment to the Labour Act (Nepal)?
- **Answer:** c) 2074 BS
- **Key concept:** Labour Act 2074 superseded the 2048 Act; recent amendments modernise gratuity, social security, contracts.

#### Q5. Parallel TCP connections used by FTP?
- **Answer:** b) 2 (one control, one data)
- **Key concept:** FTP uses port 21 for commands and port 20 (active) or ephemeral (passive) for data.

#### Q6. Which law is based on conservation of charge?
- **Answer:** a) KCL — Kirchhoff's Current Law
- **Key concept:** Σ I_in = Σ I_out at any node; KVL is based on conservation of energy.

#### Q7. Primary purpose of a Project Charter?
- **Answer:** a) Outline project scope and objectives
- **Key concept:** The charter authorises the project and identifies stakeholders, goals, and high-level scope.

#### Q8. How many transistors in a Class A amplifier?
- **Answer:** a) 1
- **Key concept:** Single transistor biased to conduct over the full 360° of input cycle.

#### Q9. Purpose of Gradient Descent?
- **Answer:** b) Iteratively minimise a function by moving along the negative gradient
- **Key concept:** θ ← θ − η ∇L(θ).

#### Q10. Waterfall model is the oldest approach for?
- **Answer:** a) Software engineering
- **Key concept:** Royce (1970) — first formalised SDLC with sequential phases.

#### Q11. IEEE standard for wireless networks?
- **Answer:** b) 802.11
- **Key concept:** 802.11 family (a/b/g/n/ac/ax/be) = Wi-Fi.

#### Q12. Fan-out in digital circuits?
- **Answer:** b) Number of standard loads the output can drive
- **Key concept:** Limited by the output's drive current vs. each input's load.

#### Q13. Total number of registered professional engineers in NEC?
- **Answer:** b) 61 (per the paper; figure changes over time)
- **Key concept:** Number of categories of professional engineer registration as defined by NEC by-laws.

#### Q14. What is a viewport?
- **Answer:** c) Visible area of a webpage/canvas inside a browser window
- **Key concept:** In graphics, viewport = the screen region onto which the world coordinates are mapped.

#### Q15. Feature of 8086 internal architecture?
- **Answer:** b) 16-bit data bus (internal & external)
- **Key concept:** 8086 is true 16-bit; 8088 has 16-bit internal, 8-bit external.

#### Q16. GUI stands for?
- **Answer:** b) Graphical User Interface
- **Key concept:** WIMP — Windows, Icons, Menus, Pointer.

#### Q17. What does an IP address contain?
- **Answer:** c) Network portion + Host portion
- **Key concept:** Subnet mask separates network (left) from host (right) bits.

#### Q18. What value type is "230 V" on a heater label?
- **Answer:** c) RMS value
- **Key concept:** Mains AC ratings are always RMS; peak = √2·RMS ≈ 325 V for 230 V mains.

#### Q19. Which function classifies into 3+ classes?
- **Answer:** c) Softmax
- **Key concept:** Softmax outputs a probability distribution over K classes; sigmoid is binary.

#### Q20. What is a contingent project?
- **Answer:** b) One that depends on the outcome of another project
- **Key concept:** Contingent ≠ contingency: dependence on a precursor's go/no-go decision.

#### Q21. In dimensionality, R refers to?
- **Answer:** b) Real numbers (ℝ)
- **Key concept:** ℝⁿ = n-dimensional real Euclidean space.

#### Q22. Fastest line-drawing algorithm?
- **Answer:** b) Bresenham's algorithm
- **Key concept:** Integer-only arithmetic; avoids floating-point of DDA.

#### Q23. What shape becomes a unit square after shearing?
- **Answer:** b) Parallelogram
- **Key concept:** Shear maps `(x, y) → (x + ky, y)` (or reverse) preserving area; sides remain parallel.

#### Q24. Worst-case complexity of Shell sort?
- **Answer:** c) O(n²) (gap sequence dependent; Shell's original is O(n²))
- **Key concept:** Best gap sequences (Sedgewick, Pratt) achieve O(n^4/3) or O(n log²n).

#### Q25. Tenure of the registrar of NEC?
- **Answer:** c) 4 years
- **Key concept:** NEC Act defines registrar's tenure and renewal terms.

#### Q26. Objective of NEA (Nepal Engineers' Association)?
- **Answer:** b) Promote development of engineering science and technology
- **Key concept:** NEA is a professional body; NEC is the regulator.

#### Q27. Which is **not** an application-layer protocol?
- **Answer:** d) TCP (transport layer)
- **Key concept:** FTP, SMTP, HTTP, DNS are L7; TCP/UDP live at L4.

#### Q28. How many resonance frequencies does a crystal have?
- **Answer:** b) 2 (series fs and parallel fp)
- **Key concept:** Crystal equivalent circuit has series LCR + shunt holder capacitance → two resonant peaks.

#### Q29. Flip-flops to represent flags of 8085?
- **Answer:** a) 5 (S, Z, AC, P, CY)
- **Key concept:** Sign, Zero, Auxiliary-carry, Parity, Carry flags.

#### Q30. Warshall's algorithm computes?
- **Answer:** a) Transitive closure
- **Key concept:** Boolean reachability matrix; Floyd-Warshall is the weighted variant for shortest paths.

#### Q31. Most stable BJT bias configuration?
- **Answer:** a) Voltage-divider bias
- **Key concept:** β-independent operating point owing to emitter degeneration + base voltage divider.

#### Q32. SR flip-flop is called?
- **Answer:** b) Bistable multivibrator
- **Key concept:** (Repeat of Set I Q4.)

#### Q33. Space complexity of Iterative Deepening DFS?
- **Answer:** c) O(d) (= O(bd) including branching; O(d) in stack depth only)
- **Key concept:** Linear in solution depth — IDDFS combines BFS optimality with DFS memory.

#### Q34. ANN doesn't have?
- **Answer:** a) Explanation of results
- **Key concept:** (Repeat — black-box problem.)

#### Q35. Key property of bilateral circuits?
- **Answer:** c) Same impedance regardless of direction of current flow
- **Key concept:** R, L, C are bilateral; diodes are unilateral.

#### Q36. Signed-int types live in which C++ header?
- **Answer:** c) `<cstdint>`
- **Key concept:** `<cstdint>` defines `int8_t`, `int16_t`, `int32_t`, `int64_t` and unsigned counterparts.

#### Q37. C++ `for` loop syntax?
- **Answer:** a) `for (initialization; condition; increment/decrement)`
- **Key concept:** Three semicolon-separated clauses; any may be empty.

#### Q38. `int *p = NULL;` means?
- **Answer:** a) `p` is a null pointer
- **Key concept:** NULL ≡ 0 (in C++ prefer `nullptr` — type-safe).

#### Q39. If a derived class has a constructor, which runs first?
- **Answer:** b) Base class constructor first, then derived
- **Key concept:** Base must be fully constructed before derived members can use it; destruction order is reverse.

#### Q40. Pumping Lemma detects?
- **Answer:** b) Non-regular language (proof by contradiction)
- **Key concept:** If you can find a string that can't be pumped, the language is *not* regular.

#### Q41. Non-maskable interrupt is?
- **Answer:** a) TRAP
- **Key concept:** (Repeat — only TRAP in 8085 is non-maskable.)

#### Q42. In a sequence diagram, vertical line indicates?
- **Answer:** a) Time (top = earlier)
- **Key concept:** Lifelines run vertically; horizontal arrows = messages between objects.

#### Q43. 8085 register connected to the data bus?
- **Answer:** b) MBR (Memory Buffer Register)
- **Key concept:** MBR (a.k.a. MDR) latches data going to/from memory; MAR drives the address bus.

#### Q44. Which IPSec mode provides privacy, integrity, and authenticity?
- **Answer:** a) Tunnel mode (encapsulates the entire IP packet)
- **Key concept:** Tunnel mode is used for VPNs; transport mode protects only the payload.

#### Q45. If an SMTP server sends mail to another server, it is?
- **Answer:** a) SMTP client (for that hop)
- **Key concept:** SMTP is symmetric peer-to-peer; the sender role is "client" regardless of usual server status.

#### Q46. Connectionless protocol?
- **Answer:** a) UDP
- **Key concept:** UDP fires-and-forgets datagrams; TCP is connection-oriented.

#### Q47. A finite-state machine has how many tuples?
- **Answer:** c) 6  (Q, Σ, δ, q₀, F, [Γ for some texts]) or 5 in the classical Hopcroft-Ullman definition
- **Key concept:** Classical FA: (Q, Σ, δ, q₀, F). Counts vary by textbook.

#### Q48. Representation of composition of two TM languages?
- **Answer:** b) TM1 + TM2 (paper's answer; textbooks usually write L(TM1)·L(TM2) or L₁∘L₂)
- **Key concept:** Composition / concatenation of TM-recognisable languages is closed.

#### Q49. 2D transformations require?
- **Answer:** b) 2D plane (3×3 homogeneous matrix)
- **Key concept:** Homogeneous coordinates `[x, y, 1]` allow rotation, scaling, *and* translation as a single matrix multiply.

#### Q50. Binary tree of height h has at most ___ nodes?
- **Answer:** b) 2^(h+1) − 1 (root at h=0)
- **Key concept:** Geometric sum over levels.

#### Q51. Direct access is seen in?
- **Answer:** a) Disk *(paper's answer)*; RAM also qualifies
- **Key concept:** "Direct access" means any block reachable in roughly constant time (versus sequential tape).

#### Q52. Incremental model is?
- **Answer:** a) Linear + Waterfall (i.e., repeated mini-waterfalls)
- **Key concept:** Each increment delivers usable functionality; risk reduced compared to one big waterfall.

#### Q53. Optimisation algorithms use?
- **Answer:** a) Heuristics
- **Key concept:** Meta-heuristics (GA, SA, PSO) trade optimality for tractability.

#### Q54. Process of developing modules from sub-systems?
- **Answer:** a) Modular decomposition
- **Key concept:** Top-down design: system → subsystem → module → unit.

#### Q55. Which UML diagram models the flow of control or data?
- **Answer:** b) Activity diagram
- **Key concept:** Activity diagrams = workflow / flow-of-control; data-flow diagrams (non-UML) show data movement.

#### Q56. Association represents in UML?
- **Answer:** a) Relationship between classes
- **Key concept:** Association lines (with multiplicity) capture structural links; inheritance uses a hollow triangle.

#### Q57. Tuples in a Turing machine?
- **Answer:** c) 7  (Q, Σ, Γ, δ, q₀, q_accept, q_reject) [or B for blank]
- **Key concept:** Standard 7-tuple definition.

#### Q58. To whom does the registrar submit annual plans of council?
- **Answer:** The paper leaves this open. Per NEC Act: to the **Council** (option c).
- **Key concept:** Internal NEC governance — registrar reports to the elected Council.

#### Q59. Port used for HTTP/HTML?
- **Answer:** a) 80 (HTTP); 443 is HTTPS
- **Key concept:** Common well-known ports: 21 FTP, 22 SSH, 25 SMTP, 53 DNS, 80 HTTP, 443 HTTPS.

#### Q60. Repetitive analysis takes which measure?
- **Answer:** a) LCM (Least Common Multiple)
- **Key concept:** For periodic schedule analysis, the hyperperiod = LCM of all task periods.

---

### Set II · Section B (20 × 2)

#### B1. Alpha-beta pruning — values of α and β?
- **Answer:** d) Dynamic values that change during the search
- **Key concept:** α = best already-explored value for MAX, β = best for MIN; updated on every node visit. Prune when β ≤ α.

#### B2. Correct order of processes in Computer Vision?
- **Answer:** b) Image acquisition → processing → segmentation → analysis
- **Key concept:** Pipeline: capture → enhance/denoise → split into regions → extract/interpret features.

#### B3. 10-node mesh — how many duplex links?
- **Answer:** a) 45
- **Key concept:** n(n-1)/2 = 10·9/2 = 45 full-duplex (or n(n-1) = 90 simplex).

#### B4. "Wound and wait" deadlock outcome?
- **Answer:** a) T1 wounds T2 for B and T2 must wait for A *(specific to given pair)*
- **Key concept:** Wound-wait: older transaction *wounds* (aborts) younger; younger waits when needing older's lock.

#### B5. `try { throw 20; } catch (int e) { cout << e; }` output?
- **Answer:** b) Exception caught: 20
- **Key concept:** Integer thrown → caught by `catch(int)`; printed verbatim.

#### B6. Calling `sayHello` from `Second` namespace after `First::sayHello();`?
- **Answer:** b) `Second::sayHello();`
- **Key concept:** Namespace scoping uses `::`. Dot `.` is for objects/structs.

#### B7. 250 V bulb, 0.3 A current. Power?
- **Answer:** a) 75 W
- **Key concept:** P = VI = 250·0.3 = 75 W.

#### B8. Multiple orders to a single customer — relationship type?
- **Answer:** A) Many-to-One (orders→customer); B) One-to-Many (customer→orders) — both correct depending on direction.
- **Key concept:** Cardinality direction matters; same relationship viewed from each side.

#### B9. 2's complement of 10101101
- **Answer:** Invert → 01010010, then +1 → **01010011**
- **Key concept:** 2's complement = 1's complement + 1; same as `-x mod 2ⁿ`.

#### B10. Which string is derivable from S → aSb | AB, A → aA | ε, B → bB | ε?
- a) aababb · b) aaabbb · c) ababab · d) aabb
- **Answer:** a) aababb (one S→aSb expansion then AB → aa·bb)
- **Key concept:** Derive by repeated application of production rules.

#### B11. Preemptive scheduling algorithm?
- **Answer:** C) Round Robin
- **Key concept:** RR uses a time quantum and preempts. FCFS/SJN/HRRN can be non-preemptive (SJN has preemptive variant: SRTF).

#### B12. Formula for the sigmoid activation function?
- **Answer:** σ(x) = 1 / (1 + e⁻ˣ)
- **Key concept:** Squashes input to (0, 1); derivative σ′ = σ(1 − σ).

#### B13. Construct BST from postorder 2,4,3,7,9,8,5
- **Tree:**
  ```
          5
         / \
        3   8
       / \ / \
      2  4 7  9
  ```
- **Key concept:** Inorder of BST = sorted = 2,3,4,5,7,8,9; combine with postorder (root last) to rebuild.

#### B14. Resonant frequency for R = 10 Ω, L = 0.1 H, C = 10 µF
- **Answer:** c) 159 Hz
- **Key concept:** `fr = 1/(2π·√(LC)) = 1/(2π·√(0.1·10⁻⁵)) ≈ 159.2 Hz`.

#### B15. Ideal op-amp in closed-loop with negative feedback — which is true?
- **Answer:** C) Voltage difference between inverting and non-inverting inputs is zero (virtual short)
- **Key concept:** Two golden rules: (1) no current into inputs, (2) V+ = V− under negative feedback.

#### B16. What is overfitting?
- **Answer:** C) Model performs well on training data but poorly on unseen data
- **Key concept:** High variance; mitigated by regularisation, more data, cross-validation, early stopping.

#### B17. Cache of 16 words, 32 bits each. Total bytes?
- **Answer:** B) 64 bytes
- **Key concept:** 16·32 = 512 bits = 64 bytes.

#### B18. Project activities with durations F(6), G(4), H(5), I(3), J(7) — what is project duration?
- **Answer:** 21 days (paper marks 20)
- **Key concept:** Critical path = longest dependent chain. EF[J] = max(EF[G]=10, EF[I]=max(10,11)+3 = 14) + 7 = 21.

#### B19. Nominal 8% APR compounded quarterly — effective annual rate?
- **Answer:** b) 8.24%
- **Key concept:** EAR = (1 + r/n)ⁿ − 1 = (1 + 0.02)⁴ − 1 ≈ 0.0824.

#### B20. What is correct about NAND gates?
- **Answer:** a) NAND is a universal gate — can construct AND, OR, NOT, etc.
- **Key concept:** NAND and NOR are both functionally complete (universal). Any Boolean function expressible.

---

## Set III

### Set III · Section A (60 × 1)

#### Q1. Multiple threads in execution is called?
- **Answer:** b) Multithreading
- **Key concept:** Multiple threads within a single process share address space; multitasking = multiple processes.

#### Q2. Two main processes in Natural Language Processing?
- **Answer:** a) NLU (Understanding) and NLG (Generation)
- **Key concept:** NLU = input parsing/intent; NLG = output synthesis.

#### Q3. Key limitation of Finite State Machines?
- **Answer:** c) Cannot handle context-dependent behaviour (no memory beyond state)
- **Key concept:** FSMs lack a stack — can't recognise nested/balanced structures; that needs a PDA.

#### Q4. Parallel TCP connections used by FTP?
- **Answer:** b) 2 (control + data)
- **Key concept:** (Same as Set II Q5.)

#### Q5. No-load voltage gain of BJT in fixed-bias configuration?
- **Answer:** a) -β·(Rc/re)
- **Key concept:** Same as CE topology; β = current gain, re = intrinsic emitter resistance.

#### Q6. 3D rotation matrix around z-axis?
- **Answer:**
  ```
  [ cosθ  -sinθ  0  0 ]
  [ sinθ   cosθ  0  0 ]
  [   0      0   1  0 ]
  [   0      0   0  1 ]
  ```
- **Key concept:** Rotation about z preserves z-coordinate; x and y rotate by θ.

#### Q7. Multiprocessor synchronisation typically uses?
- **Answer:** a) Semaphores or mutexes
- **Key concept:** Mutex = mutual exclusion, semaphore = counter-based signalling. Atomic CAS underpins both.

#### Q8. Transformation matrix for oblique parallel projection?
- **Answer:** a) — non-zero shearing terms in xz/yz rows
- **Key concept:** Oblique projection preserves parallelism but tilts the projection direction (e.g. cavalier or cabinet).

#### Q9. Three 2 Ω resistors in a triangle (delta) — resistance between any two terminals?
- **Answer:** c) 1.33 Ω
- **Key concept:** From any two nodes, 2 Ω is in parallel with (2 + 2) Ω = 4 Ω → 2·4/(2+4) = 8/6 = 1.33 Ω.

#### Q10. Average-case complexity of Quicksort?
- **Answer:** c) O(n log n)
- **Key concept:** Worst case is O(n²) on already-sorted with poor pivot; random pivot or median-of-three avoids it.

#### Q11. Purpose of virtual memory?
- **Answer:** a) Provide an illusion of larger main memory than physical
- **Key concept:** Paging + page tables enable processes to address more memory than RAM by spilling to disk.

#### Q12. How many main types of parsing?
- **Answer:** c) Two: Top-down and Bottom-up
- **Key concept:** Top-down (LL, recursive descent), Bottom-up (LR, SLR, LALR).

#### Q13. Compiler vs interpreter difference?
- **Answer:** a) Compiler translates the entire program at once; interpreter translates line-by-line
- **Key concept:** Compilation produces a separate executable; interpretation executes directly. JIT blurs the line.

#### Q14. How does capacitive reactance change with frequency?
- **Answer:** b) Decreases  (Xc = 1/(2πfC))
- **Key concept:** Capacitor "looks like" a short at high frequency, open at DC.

#### Q15. Transistors used in Class A amplifier?
- **Answer:** a) 1
- **Key concept:** (Same as Set II Q8.)

#### Q16. `Ti<A, v1, v2>` in databases represents?
- **Answer:** b) A transaction (Ti with attribute A, values v1, v2)
- **Key concept:** Notation for log records: transaction Ti updated A from v1 to v2.

#### Q17. Annual worth = 9000, capitalized worth at 10%?
- **Answer:** c) 90,000
- **Key concept:** CW = AW / i = 9000 / 0.10 = 90,000.

#### Q18. Types of perspective projection?
- **Answer:** b) 1-point, 2-point, 3-point
- **Key concept:** (Repeat — based on vanishing-point count.)

#### Q19. P and V operations in semaphores?
- **Answer:** b) P = wait (decrement), V = signal (increment)
- **Key concept:** (Dijkstra notation.)

#### Q20. Who verifies and documents changes in a software project?
- **Answer:** b) SQA team
- **Key concept:** SQA owns process compliance; configuration management tracks artefacts.

#### Q21. Waterfall is the oldest model for?
- **Answer:** c) Software engineering
- **Key concept:** (Same as Set II Q10.)

#### Q22. Fan-in refers to?
- **Answer:** d) Number of inputs a logic gate can handle
- **Key concept:** Fan-in limits stem from input loading; fan-out limits stem from output drive.

#### Q23. Admissibility in A*?
- **Answer:** c) The heuristic never overestimates the true cost to the goal
- **Key concept:** Admissible → optimal solutions; consistent (monotone) → also efficient (no re-expansions).

#### Q24. "Father of AI"?
- **Answer:** b) John McCarthy (coined term in 1955)
- **Key concept:** McCarthy organised the 1956 Dartmouth conference and invented LISP.

#### Q25. STP (Shielded Twisted Pair) typical connector?
- **Answer:** c) RJ45
- **Key concept:** RJ45 8P8C plug for Ethernet; RJ11 is for telephone.

#### Q26. Purpose of `volatile` in C?
- **Answer:** b) Indicates a variable may change unexpectedly (e.g. hardware register, ISR)
- **Key concept:** Prevents compiler from caching the variable in a register / optimising away reads.

#### Q27. Difference between process and thread?
- **Answer:** a) Process is independent; thread is a unit of execution within a process
- **Key concept:** Threads share process memory; processes have isolated address spaces.

#### Q28. Output of a given C++ program (paper has missing code)?
- **Answer:** c) `]`
- **Key concept:** Likely involves printing `']'` — without code, accept the paper's marked answer.

#### Q29. Wien bridge oscillator — type?
- **Answer:** b) Low-frequency (audio range, sinusoid)
- **Key concept:** Uses RC network for selectivity; popular for clean sinewaves in 10 Hz – 1 MHz range.

#### Q30. Which is not a decoder: 4:2 / 8:3 / 16:4 / 5:32?
- **Answer:** d) 5:32 (a decoder should map n inputs → 2ⁿ outputs, so 5→32 would be valid; the paper marks it as the odd one out because 4:2, 8:3, 16:4 are *encoders* not decoders)
- **Key concept:** Decoder = n→2ⁿ; encoder = 2ⁿ→n. 4:2, 8:3, 16:4 are encoders. So 5:32 is the only *decoder* listed.

#### Q31. Which cannot be used as a variable name in C: `true` or `while`?
- **Answer:** b) `while` (reserved keyword); `true` was not a C89 keyword (only in C99 with `<stdbool.h>`)
- **Key concept:** C reserved words list — `while`, `for`, `if`, `else`, `int`, `return`, etc.

#### Q32. Software ready after which iteration in Spiral?
- **Answer:** d) Usually after 4th or 5th iteration
- **Key concept:** Each spiral loop = plan → risk-analyze → engineer → evaluate; usable software emerges in later loops.

#### Q33. Priority interruptions use?
- **Answer:** d) Daisy chain and polling
- **Key concept:** Daisy-chain hardware priority chain; polling = software priority check.

#### Q34. CPU response signal to a PIC?
- **Answer:** a) INTA (Interrupt Acknowledge)
- **Key concept:** PIC asserts INTR, CPU responds with INTA pulse to read the interrupt vector.

#### Q35. Three main elements of a use case?
- **Answer:** a) Actor, System, Goal
- **Key concept:** Each use case has a goal a primary actor wants to achieve via the system.

#### Q36. Primary function of a device driver?
- **Answer:** a) Interface between OS and hardware
- **Key concept:** Drivers expose device-specific operations through standard OS APIs (open/read/write/ioctl).

#### Q37. Features of RISC architecture?
- **Answer:** c) Simple instructions, more registers, load/store architecture
- **Key concept:** RISC: fixed-length instructions, pipelining-friendly, large register file, only load/store accesses memory.

#### Q38. What happens when an exception occurs in C++?
- **Answer:** c) An exception handler function is called
- **Key concept:** Stack unwinds; nearest matching `catch` block runs; destructors called for in-scope objects.

#### Q39. How can a weak entity set be changed into a strong entity set?
- **Answer:** b) By introducing a primary key
- **Key concept:** Weak entity depends on owner for identification; adding its own key makes it strong.

#### Q40. Architecture used by FTP?
- **Answer:** b) Client-server
- **Key concept:** Client opens control connection to server's port 21; data channel established subsequently.

#### Q41. Most important step in a Genetic Algorithm?
- **Answer:** c) Selection
- **Key concept:** Selection drives evolution toward higher fitness; crossover/mutation introduce variation.

#### Q42. Cryptography that uses two keys?
- **Answer:** b) Asymmetric cryptography
- **Key concept:** Public key for encryption/verification, private key for decryption/signing. RSA, ECC.

#### Q43. Function overloading uses?
- **Answer:** c) Both type and arguments (number)
- **Key concept:** Signature = name + parameter types + arity; return type alone does *not* overload.

#### Q44. Valid pointer definition in C?
- **Answer:** b) `p = &a`
- **Key concept:** Address-of (`&`) yields a pointer; you can't take an address into a non-pointer.

#### Q45. A tautology is always?
- **Answer:** b) True (under every truth assignment)
- **Key concept:** Contradiction = always false; contingency = sometimes true, sometimes false.

#### Q46. Excess-3 code is also known as?
- **Answer:** b) Self-complementing code
- **Key concept:** XS-3 representation of decimal: 9's complement is obtained by bitwise NOT.

#### Q47. Purpose of normalisation in database design?
- **Answer:** c) Reduce data redundancy and improve data integrity
- **Key concept:** 1NF → 2NF → 3NF → BCNF, eliminating various anomalies (insert/update/delete).

#### Q48. Stack vs Queue?
- **Answer:** b) Stack is LIFO, Queue is FIFO
- **Key concept:** Stack: push/pop on same end; Queue: enqueue rear, dequeue front.

#### Q49. Purpose of virtual function in C++?
- **Answer:** b) Achieve runtime polymorphism (dynamic dispatch)
- **Key concept:** Virtual table (vtable) used to look up the right override at runtime.

#### Q50. Main advantage of optical fibre?
- **Answer:** c) High bandwidth and low signal loss (also EMI-immune)
- **Key concept:** Light-pulse transmission supports Gb/s–Tb/s rates over km with low attenuation (0.2 dB/km).

#### Q51. Purpose of the OSI model?
- **Answer:** b) Standardise communication functions of telecommunication systems
- **Key concept:** ISO/IEC 7498 — 7-layer reference model for inter-vendor interoperability.

#### Q52. Static vs dynamic binding?
- **Answer:** c) Static = compile-time; Dynamic = run-time
- **Key concept:** Function overloading = static; virtual functions = dynamic.

#### Q53. Purpose of cache?
- **Answer:** b) Reduce average data-access time from main memory
- **Key concept:** Cache exploits locality (spatial + temporal) so most accesses hit fast SRAM.

#### Q54. Cohesion vs coupling?
- **Answer:** c) Cohesion = within-module strength; Coupling = between-module interdependence
- **Key concept:** Good design: **high cohesion, low coupling**.

#### Q55. `volatile` in Java?
- **Answer:** b) Indicates a variable may be modified by multiple threads
- **Key concept:** Ensures reads/writes are not cached in thread-local registers (visibility), but does not provide atomicity.

#### Q56. TCP vs UDP?
- **Answer:** c) TCP = connection-oriented, reliable; UDP = connectionless, unreliable but faster
- **Key concept:** TCP provides ordering, retransmission, congestion control; UDP fires datagrams with no setup.

#### Q57. Purpose of Fourier transform?
- **Answer:** c) Convert signal from time domain to frequency domain
- **Key concept:** Decomposes a signal into sinusoidal components — used in filtering, compression, modulation.

#### Q58. Deep vs shallow copy?
- **Answer:** c) Deep copy duplicates nested objects; shallow copy duplicates references
- **Key concept:** Deep copy is independent; shallow copy still shares inner objects → mutation visible to original.

#### Q59. Purpose of a load balancer?
- **Answer:** b) Distribute traffic across multiple servers
- **Key concept:** Algorithms: round-robin, least connections, weighted, IP-hash; provides scalability + redundancy.

#### Q60. Supervised vs unsupervised learning?
- **Answer:** b) Supervised uses labelled data; unsupervised uses unlabelled
- **Key concept:** Supervised → regression/classification; unsupervised → clustering, dimensionality reduction.

---

### Set III · Section B (20 × 2)

#### B1. Logical AND then OR composition in Warshall-like recurrence?
- **Answer:** B) Tij(k) = Tij(k-1) **OR** (Tik(k-1) **AND** Tkj(k-1))
- **Key concept:** Warshall's transitive-closure update rule — bit-OR with the AND of two intermediate paths.

#### B2. Problem with an algorithm that always halts with correct yes/no?
- **Answer:** A) Turing Decidable (= Recursive)
- **Key concept:** Decidable ⇔ recursive ⇔ a TM that always halts. RE = halts on YES; may loop on NO.

#### B3. Primary purpose of decomposing a reference architecture?
- **Answer:** B) Simplify design and implementation by breaking into manageable components
- **Key concept:** Modularity / separation of concerns.

#### B4. Correct one-to-many example?
- **Answer:** A) One department has many employees
- **Key concept:** Each child belongs to one parent; parent has many children. B is many-to-many; C/D are many-to-one viewed wrong direction.

#### B5. Scale (2,0,3) by (2,2,4)?
- **Answer:** a) (4, 0, 12)
- **Key concept:** Component-wise multiply: (2·2, 0·2, 3·4).

#### B6. GA fitness `f(x) = 1/(1 + conflicts)` measures?
- **Answer:** b) Number of conflicts in the schedule
- **Key concept:** Inverse-of-error fitness: higher fitness ⇒ fewer conflicts; converges to conflict-free schedule.

#### B7. Demand paging — service 1000 ms, access 20 ms, fault rate 0.01. EAT?
- **Answer:** d) 29.8 ms
- **Key concept:** EAT = 0.99·20 + 0.01·1000 = 19.8 + 10 = 29.8 ms.

#### B8. Capacitance is directly proportional to?
- **Answer:** a) Area of plates
- **Key concept:** `C = εA/d`. Directly proportional to A, inversely proportional to d.

#### B9. Convert decimal 156 to octal?
- **Answer:** d) 234₈
- **Key concept:** 156 = 2·64 + 3·8 + 4·1 = (234)₈. Or repeated /8 with remainders.

#### B10. Error in `for(int i = 0; i <= size; i++) { cout << arr[i]; }` when called with arr-size?
- **Answer:** B) Runtime Error *(out-of-bounds read; undefined behaviour)*
- **Key concept:** Off-by-one — should be `i < size`. Accessing `arr[size]` is UB.

#### B11. `int a=5; int *p=&a; *p = *p*2; a = a+3; cout << *p << a;`
- **Answer:** A) 10 then 13
- **Key concept:** `*p = *p*2` makes a = 10; then `a = a+3` makes a = 13. `*p` is just an alias for `a`, so both reflect the latest value… *actually both should print 13.* Paper marks A because of expected printout order: after `*p = *p*2` (cache state), but it's a snapshot before `a + 3`. *Practical answer:* both print 13.

#### B12. Output of given CFG?
- **Answer:** B) aabb
- **Key concept:** S→AB, A→aA|ε, B→bB|ε → terminating with A→aa and B→bb yields aabb.

#### B13. Twisted-pair cable falls under which transmission media?
- **Answer:** a) Guided media
- **Key concept:** Guided = wired (twisted pair, coax, fibre); unguided = wireless (radio, microwave, IR).

#### B14. Shortest-Job-Next on P1(AT=0,BT=8), P2(1,4), P3(2,2), P4(3,6). Average turnaround time?
- **Answer:** b) 11.5
- **Key concept:** Non-preemptive SJN: P1 runs 0-8; among arrivals, shortest = P3 (8-10); then P2 (10-14); then P4 (14-20). TATs: 8, 13, 8, 17 → mean = 11.5.

#### B15. Correct phase order of Waterfall model?
- **Answer:** A) Requirements → Design → Implementation → Integration & Testing → Deployment → Maintenance
- **Key concept:** Strict sequential SDLC; each phase complete before the next starts.

#### B16. Characteristic of an ideal op-amp?
- **Answer:** B) Infinite input impedance, zero output impedance
- **Key concept:** Also: infinite open-loop gain, infinite bandwidth, zero offset.

#### B17. Main objective of supervised learning?
- **Answer:** C) Learn mapping from inputs to outputs using labelled data
- **Key concept:** Minimise loss `L(f(x), y)` over labelled `(x, y)` pairs.

#### B18. Full binary tree — leaves L in terms of internal nodes I?
- **Answer:** b) L = I + 1
- **Key concept:** In a *full* (strict) binary tree, every internal node has 2 children → leaves = internal + 1.

#### B19. FIFO page replacement, increase frames from 3 to 4 — page transfers ___?
- **Answer:** b) Increases (Belady's anomaly)
- **Key concept:** FIFO is not a stack algorithm; adding frames may *increase* faults. LRU/OPT do not suffer this.

#### B20. $1,000 at 5% APR compounded quarterly for 3 years — future value?
- **Answer:** b) $1,227.5 (paper) — by formula FV = 1000·(1 + 0.05/4)^(4·3) = 1000·(1.0125)^12 ≈ $1,160.75
- **Key concept:** FV = P·(1 + r/n)^(n·t). The exact answer depends on rounding/compounding interpretation.

---

## How to use this set

- **Pass 1** — Read straight through, marking questions you got wrong or guessed.
- **Pass 2** — For each "wrong" question, write the **key concept** in your own words. The phrasing matters more than the answer.
- **Pass 3** — Spaced repetition on the 30 hardest questions until you can produce them from prompts alone.

### Topic frequency snapshot

| Domain | Approximate count (across 3 sets) |
|---|---|
| Digital logic & combinational/sequential circuits | 25+ |
| Microprocessors (8085 / 8086) | 12+ |
| Operating systems (scheduling, semaphores, paging) | 18+ |
| Computer networks (OSI, TCP/UDP, protocols) | 18+ |
| Software engineering (SDLC models, UML) | 15+ |
| AI / ML (search, learning, ANN) | 18+ |
| Databases (SQL, ER, normalisation) | 10+ |
| Computer graphics (transformations, projections) | 10+ |
| Electronics (BJT, amplifiers, op-amps, filters) | 15+ |
| Engineering economics & project management | 10+ |
| Theory of computation (automata, grammars) | 12+ |
| NEC bylaws / professional practice | 6+ |

Focus your revision proportional to these weights — about a third of the paper is **OS + Networks + AI/ML**.
