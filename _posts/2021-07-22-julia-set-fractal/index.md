---
title: "Julia Set Fractal"
date: 2021-07-22
category: "Mathematics"
tags: [fractals, mathematics, python, visualization, complex-numbers]
---

![Julia Set](/posts/2021/07/22/julia-set-fractal/julia-set-fractal-julia2.png "Julia Set")

The Julia set is named after the French mathematician Gaston Julia who investigated their properties circa 1915 and culminated in his famous paper in 1918. While the Julia set is now associated with a simpler polynomial, Julia was interested in the iterative properties of a more general expression, namely

z4 + z3/(z-1) + z2/(z3 + 4 z2 + 5) + c.

The Julia set is now associated with those points z = x + iy on the complex plane for which the series z(n+1) = zn² + c does not tend to infinity. c is a complex constant, one gets a different Julia set for each c. The initial value z0 for the series is each point in the image plane. In the broader sense the exact form of the iterated function may be anything, the general form being z(n+1) = f(zn), interesting sets arise with non-linear functions f(z). Commonly used functions include the following:

- z(n+1) = c sin(zn)
- z(n+1) = c exp(zn)
- z(n+1) = c i cos(zn)
- z(n+1) = c zn (1 - zn)

Computing a Julia set by computer is straightforward, at least by the brute force method presented here. The image is created by mapping each pixel to a rectangular region of the complex plane. Each pixel then represents the starting point for the series, z0. The series is computed for each pixel and if it diverges to infinity it is drawn in white, if it doesn't then it is drawn black. This convergence or otherwise isn't always obvious and it may take a large number of iterations to resolve so a decision procedure is required to determine divergence. This typically involves assuming the series tends to infinity as soon as its value exceeds some value, if the series hasn't diverged after a certain number of terms it is similarly assigned to be part of the set. Both these decisions can be varied to give more precise images but ones that take longer to calculate. An added effect is achieved by colouring the point by how fast it diverges to infinity.

The well known Mandelbrot set forms a kind of index into the Julia set. A Julia set is either connected or disconnected, values of c chosen from within the Mandelbrot set are connected while those from the outside of the Mandelbrot set are disconnected. The disconnected sets are often called "dust", they consist of individual points no matter what resolution they are viewed at. [Above mentioned lines are taken from this website.](http://paulbourke.net/fractals/juliaset/)

## Code

```python
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.cm as cm

# Image width and height; parameters for the plot
im_width, im_height = 5000, 5000

rel = float(input("enter the real part"))
img = float(input("enter the img part"))

c = complex(rel, img)
zabs_max = 10
nit_max = 1000
xmin, xmax = -1.5, 1.5
xwidth = xmax - xmin
ymin, ymax = -1.5, 1.5
yheight = ymax - ymin


julia = np.zeros((im_width, im_height))
for ix in range(im_width):
    for iy in range(im_height):
        nit = 0
        # Map pixel position to a point in the complex plane
        z = complex(ix / im_width * xwidth + xmin,
                    iy / im_height * yheight + ymin)
        # Do the iterations
        while abs(z) <= zabs_max and nit < nit_max:
            z = z**2 + c
            nit += 1
        shade = 1-np.sqrt(nit / nit_max)
        ratio = nit / nit_max
        julia[ix,iy] = ratio
```

```
enter the real part-0.54
enter the img part0.54
```

## Images

### Image 1

```python
fig, ax = plt.subplots(figsize=(50,50))
ax.imshow(julia, interpolation='nearest', cmap=cm.hot)

plt.show()
```

![Julia Set Image 1](/posts/2021/07/22/julia-set-fractal/julia-set-fractal-760544f6eec3d75daa726edaacf4f3ac9bd8545f.png)

### Image 2

```python
fig, ax = plt.subplots(figsize=(50,50))
ax.imshow(julia, interpolation='nearest', cmap=cm.hot)

plt.show()
```

![Julia Set Image 2](/posts/2021/07/22/julia-set-fractal/julia-set-fractal-6a6550760267656a6fe0998e2b5d40450df3d190.png)

### Image 3

```python
fig, ax = plt.subplots(figsize=(50,50))
ax.imshow(julia, interpolation='nearest', cmap=cm.hot)

plt.show()
```

![Julia Set Image 3](/posts/2021/07/22/julia-set-fractal/julia-set-fractal-3ac4f58d3feddcf8d921f9ef1d1f8932323ed256.png)

### Image 4

```python
fig, ax = plt.subplots(figsize=(50,50))
ax.imshow(julia, interpolation='nearest', cmap=cm.hot)

plt.show()
```

![Julia Set Image 4](/posts/2021/07/22/julia-set-fractal/julia-set-fractal-a98f9d5c4e6bb26c409d16409f3c3219f0aa4228.png)

### Image 5

```python
fig, ax = plt.subplots(figsize=(50,50))
ax.imshow(julia, interpolation='nearest', cmap=cm.hot)

plt.show()
```

![Julia Set Image 5](/posts/2021/07/22/julia-set-fractal/julia-set-fractal-7517c96f3782b5704a44bed7d49e86ea0db96ae1.png)
