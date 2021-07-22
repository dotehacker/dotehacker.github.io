# Julia_Set_Fractal

![Mandelbrot](http://paulbourke.net/fractals/juliaset/julia_mandel.gif "Mandelbrot")

The Julia set is named after the French mathematician Gaston Julia who investigated their properties circa 1915 and culminated in his famous paper in 1918. While the Julia set is now associated with a simpler polynomial, Julia was interested in the iterative properties of a more general expression, namely 

z4 + z3/(z-1) + z2/(z3 + 4 z2 + 5) + c.

The Julia set is now associated with those points z = x + iy on the complex plane for which the series zn+1 = zn2 + c does not tend to infinity. c is a complex constant, one gets a different Julia set for each c. The initial value z0 for the series is each point in the image plane. In the broader sense the exact form of the iterated function may be anything, the general form being zn+1 = f(zn), interesting sets arise with non-linear functions f(z). Commonly used functions include the following:

$$z(n+1) = c sin(zn)	zn+1 = c exp(zn)

$$zn+1 = c i cos(zn)	zn+1 = c zn (1 - zn)

Computing a Julia set by computer is straightforward, at least by the brute force method presented here. The image is created by mapping each pixel to a rectangular region of the complex plane. Each pixel then represents the starting point for the series, z0. The series is computed for each pixel and if it diverges to infinity it is drawn in white, if it doesn't then it is drawn black. This convergence or otherwise isn't always obvious and it may take a large number of iterations to resolve so a decision procedure is required to determine divergence. This typically involves assuming the series tends to infinity as soon as its value exceeds some value, if the series hasn't diverged after a certain number of terms it is similarly assigned to be part of the set. Both these decisions can be varied to give more precise images but ones that take longer to calculate. An added effect is achieved by colouring the point by how fast it diverges to infinity.

The well known Mandelbrot set forms a kind of index into the Julia set. A Julia set is either connected or disconnected, values of c chosen from within the Mandelbrot set are connected while those from the outside of the Mandelbrot set are disconnected. The disconnected sets are often called "dust", they consist of individual points no matter what resolution they are viewed at.[Above Mentioned Line are taken from This website.](http://paulbourke.net/fractals/juliaset/)




<div class="cell code" execution_count="34"
colab="{&quot;base_uri&quot;:&quot;https://localhost:8080/&quot;}"
id="VaOxRal85dha" outputId="7d217942-bfc1-4a68-b8db-c804fd47b30c">

## CODE

``` python
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

<div class="output stream stdout">

    enter the real part-0.54
    enter the img part0.54

</div>

</div>

<div class="cell code" execution_count="35"
colab="{&quot;height&quot;:1000,&quot;base_uri&quot;:&quot;https://localhost:8080/&quot;}"
id="eIuEZvMKSVEe" outputId="08c639a6-2227-40ce-f1d5-2f4bec6ed56a">

## IMAGES

### IMAGE 1

``` python
fig, ax = plt.subplots(figsize=(50,50))
ax.imshow(julia, interpolation='nearest', cmap=cm.hot)

plt.show()
```

<div class="output display_data">

![](/output/images/760544f6eec3d75daa726edaacf4f3ac9bd8545f.png)

</div>

</div>

<div class="cell code" execution_count="33"
colab="{&quot;height&quot;:1000,&quot;base_uri&quot;:&quot;https://localhost:8080/&quot;}"
id="tHTy8iiVOCEU" outputId="5feb3c66-a781-4863-995e-e824e2c78325">

### IMAGE 2

``` python
fig, ax = plt.subplots(figsize=(50,50))
ax.imshow(julia, interpolation='nearest', cmap=cm.hot)

plt.show()
```

<div class="output display_data">

![](/output/images/6a6550760267656a6fe0998e2b5d40450df3d190.png)

</div>

</div>

<div class="cell code" execution_count="31"
colab="{&quot;height&quot;:1000,&quot;base_uri&quot;:&quot;https://localhost:8080/&quot;}"
id="e42uziZYMlcJ" outputId="3d2c5282-4cb6-4a1b-81ce-539f34acd3d5">

### IMAGE 3

``` python

fig, ax = plt.subplots(figsize=(50,50))
ax.imshow(julia, interpolation='nearest', cmap=cm.hot)

plt.show()
```

<div class="output display_data">

![](/output/images/3ac4f58d3feddcf8d921f9ef1d1f8932323ed256.png)

</div>

</div>

<div class="cell code" execution_count="21"
colab="{&quot;height&quot;:1000,&quot;base_uri&quot;:&quot;https://localhost:8080/&quot;}"
id="CZ5pNtt27Pys" outputId="3aa5007e-b293-4059-bc48-82bb3a3b005d">

### IMAGE 4

``` python
fig, ax = plt.subplots(figsize=(50,50))
ax.imshow(julia, interpolation='nearest', cmap=cm.hot)

plt.show()
```

<div class="output display_data">

![](/output/images/a98f9d5c4e6bb26c409d16409f3c3219f0aa4228.png)

</div>

</div>

<div class="cell code" execution_count="26"
colab="{&quot;height&quot;:1000,&quot;base_uri&quot;:&quot;https://localhost:8080/&quot;}"
id="HINQFqLvLifn" outputId="2be65274-4343-4bfc-b92e-cb8c3a745731">

### IMAGE 5

``` python
fig, ax = plt.subplots(figsize=(50,50))
ax.imshow(julia, interpolation='nearest', cmap=cm.hot)

plt.show()
```

<div class="output display_data">

![](/output/images/7517c96f3782b5704a44bed7d49e86ea0db96ae1.png)

</div>

</div>

