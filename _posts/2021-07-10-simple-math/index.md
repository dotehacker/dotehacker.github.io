---
title: "Simple Math"
date: 2021-07-10
category: "Mathematics"
tags: [python, numpy, mathematics, calculus]
---

> NUMPY AND PYTHON

## Derivative of a Polynomial Function

The following code computes the derivative of a polynomial function using NumPy.

```python
import numpy as np

def basis_function(x):
    a = np.eye(x)
    b = np.zeros((x, 1))
    c = np.concatenate((b, a), axis=1)
    d = np.array(range(1, x+1)).reshape(x, 1)
    e = c * d
    return e
```

Enter coefficients of the equation in the given pattern: constant, x, x^2, x^3, ...

```python
# ENTER HERE
d = np.array([34, 90, 34, 90])  # numbers must be separated by commas
d
```

```python
print(f'your equation is {d[0]}+{d[1]}x +{d[2]}x^2-----')

# find length
e = len(d)
y = e - 1

# reshape
d = d.reshape(e, 1)

# call basis function
f = basis_function(y)

# find derivative
g = f @ d

# print result
print(f'your derivative coeff. in order of constant,x,x^2,x^3,.... term is:- {g.reshape(1,-1)} ')
```

**Result:**

```
your equation is 90+90x +90x^2-----
your derivative coeff. in order of constant,x,x^2,x^3,.... term is:- [[ 90. 180. 270.]]
```
