# Simplemath


> NUMPY AND PYTHON

# DERIVATIVE OF polynomial function

```

import numpy as np
def basis_function(x):
    a=np.eye(x)
    b=np.zeros((x,1))
    c=np. concatenate((b,a),axis=1)
    d=np.array(range(1,x+1)).reshape(x,1)
    e=c *d
    return e
    
```
enter  coeff.of equation  in given pattern :- constant,x,x^2,x^3,....

```

#ENTER HERE [\\\\\\\\\\\\\]
d=np.array([34,90,34,90]) #NUMBER MUST BE SEPERATED BY COMMA
d

```

```
print(f'your equation is {d[0]}+{d[1]}x +{d[2]}x^2-----')
#TO FIND LENGTH
e=len(d)
y=e-1

#RESHAPE
d=d.reshape(e,1)

#CALLING BASIS FUNCTION
f=basis_function(y)

#FINDING DERIVATIVE
g=f@d

#PRINTING OUT
print(f'your derivative coeff. in order of constant,x,x^2,x^3,.... term is:- {g.reshape(1,-1)} ')

```
> Result

your equation is 90+90x +90x^2-----
your derivative coeff. in order of constant,x,x^2,x^3,.... term is:- [[ 90. 180. 270.]]


