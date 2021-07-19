# AutoEncoder


<div class="cell markdown">

# AUTO ENCODER

------------------------------------------------------------------------
<p>
    In this notebook you will find how auto encoder are trained in tensorflow(Keras). This notebook have two different type of encoder i.e normal * Auto Encoder * and * Denoising Auto Encoder * .
</p>
</div>

<div class="cell markdown">

## Normal Encoder

</div>


> LIBRARY ARE LOADED


<div class="cell code" execution_count="1">

``` python
%matplotlib inline
%config InlineBackend.figure_format = 'retina'
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import seaborn as sns
import warnings

warnings.filterwarnings('ignore')

#from __future__ import print_function
from keras.models import Model
from keras.layers import Dense, Input
from keras.datasets import mnist
from keras.regularizers import l1
from keras.optimizers import Adam
```

</div>

> FOR PLOTING OUTPUTS

<div class="cell code" execution_count="2">

``` python
def plot_autoencoder_outputs(autoencoder, n, dims):
    decoded_imgs = autoencoder.predict(x_test)

    # number of example digits to show
    n = 5
    plt.figure(figsize=(10, 4.5))
    for i in range(n):
        # plot original image
        ax = plt.subplot(2, n, i + 1)
        plt.imshow(x_test[i].reshape(*dims))
        plt.gray()
        ax.get_xaxis().set_visible(False)
        ax.get_yaxis().set_visible(False)
        if i == n/2:
            ax.set_title('Original Images')

        # plot reconstruction 
        ax = plt.subplot(2, n, i + 1 + n)
        plt.imshow(decoded_imgs[i].reshape(*dims))
        plt.gray()
        ax.get_xaxis().set_visible(False)
        ax.get_yaxis().set_visible(False)
        if i == n/2:
            ax.set_title('Reconstructed Images')
    plt.show()
```

</div>

> TRAIN TEST SPLITS

<div class="cell code" execution_count="5">

``` python
(x_train, y_train), (x_test, y_test) = mnist.load_data()

x_train = x_train.astype('float32') / 255.0
x_test = x_test.astype('float32') / 255.0
```

</div>

> RESIZED FOR PROCESSING

<div class="cell code" execution_count="6">

``` python
x_train = x_train.reshape((len(x_train), np.prod(x_train.shape[1:])))
x_test = x_test.reshape((len(x_test), np.prod(x_test.shape[1:])))

print(x_train.shape)
print(x_test.shape)
```

<div class="output stream stdout">

    (60000, 784)
    (10000, 784)

</div>

</div>

> MODEL CREATION 

<div class="cell code" execution_count="7">

``` python
input_size = 784
hidden_size = 128
code_size = 32

input_img = Input(shape=(input_size,))
hidden_1 = Dense(hidden_size, activation='relu')(input_img)
code = Dense(code_size, activation='relu')(hidden_1)
hidden_2 = Dense(hidden_size, activation='relu')(code)
output_img = Dense(input_size, activation='sigmoid')(hidden_2)

autoencoder = Model(input_img, output_img)
autoencoder.compile(optimizer='adam', loss='binary_crossentropy')
autoencoder.fit(x_train, x_train, epochs=3)
```

<div class="output stream stdout">

    Epoch 1/3
    1875/1875 [==============================] - 29s 2ms/step - loss: 0.1880
    Epoch 2/3
    1875/1875 [==============================] - 5s 3ms/step - loss: 0.1003
    Epoch 3/3
    1875/1875 [==============================] - 4s 2ms/step - loss: 0.0950

</div>

<div class="output execute_result" execution_count="7">

    <keras.callbacks.History at 0x7fc58b7709d0>

</div>

</div>

> MODEL SUMMARY(ARC.)

<div class="cell code" execution_count="8">

``` python
autoencoder.summary()
```

<div class="output stream stdout">

    Model: "model"
    _________________________________________________________________
    Layer (type)                 Output Shape              Param #   
    =================================================================
    input_1 (InputLayer)         [(None, 784)]             0         
    _________________________________________________________________
    dense (Dense)                (None, 128)               100480    
    _________________________________________________________________
    dense_1 (Dense)              (None, 32)                4128      
    _________________________________________________________________
    dense_2 (Dense)              (None, 128)               4224      
    _________________________________________________________________
    dense_3 (Dense)              (None, 784)               101136    
    =================================================================
    Total params: 209,968
    Trainable params: 209,968
    Non-trainable params: 0
    _________________________________________________________________

</div>

</div>

> MODEL OUTPUT

<div class="cell code" execution_count="9">

``` python
plot_autoencoder_outputs(autoencoder, 5, (28, 28))
```

<div class="output display_data">

<img src="/outputs/image/3d3233457c77b00432ba448b69404dac59c1c6d7.png" width="575" height="247" />

</div>

</div>

> MODEL TEST

<div class="cell code" execution_count="10">

``` python
l=np.zeros((28,12))
m=np.ones((28,4))*0.8
r=np.zeros((28,12))
I=np.concatenate((l,m,r),axis=1).reshape(1,784)
plt.imshow(I.reshape(28,28))
L= autoencoder.predict(I)
```

<div class="output display_data">

<img src="/outputs/image/f042a704fc3050ab0ac1f1aca34e6f3ea4fb820f.png" width="251" height="248" />

</div>

</div>

<div class="cell code" execution_count="11">

``` python
print(L.shape)
plt.figure(figsize=(8, 8))
plt.imshow(L.reshape(28,28))
```

<div class="output stream stdout">

    (1, 784)

</div>

<div class="output execute_result" execution_count="11">

    <matplotlib.image.AxesImage at 0x7fc57026c700>

</div>

<div class="output display_data">

<img src="/outputs/image/1187eaa59a83b1c5aab9c55a553b8dac94481c9a.png" width="469" height="465" />

</div>

</div>

> MODEL WEIGHTS VISUALIZATION

<div class="cell code" execution_count="12">

``` python
weights = autoencoder.get_weights()[0].T

n = 10
plt.figure(figsize=(20, 5))
for i in range(n):
    ax = plt.subplot(1, n, i + 1)
    plt.imshow(weights[i+0].reshape(28, 28))
    ax.get_xaxis().set_visible(False)
    ax.get_yaxis().set_visible(False)
    
```

<div class="output display_data">

<img src="/outputs/image/a028361ab13e4f4365a3e767ff1839d233c27ed3.png" width="1133" height="112" />

</div>

</div>

<div class="cell code">

``` python
```

</div>

<div class="cell markdown">

## DENOISING AUTO ENCODER

</div>

> DATA CREATION

<div class="cell code" execution_count="13">

``` python
noise_factor = 0.4
x_train_noisy = x_train + noise_factor * np.random.normal(size=x_train.shape) 
x_test_noisy = x_test + noise_factor * np.random.normal(size=x_test.shape)

x_train_noisy = np.clip(x_train_noisy, 0.0, 1.0)
x_test_noisy = np.clip(x_test_noisy, 0.0, 1.0)

n = 5
plt.figure(figsize=(10, 4.5))
for i in range(n):
    # plot original image
    ax = plt.subplot(2, n, i + 1)
    plt.imshow(x_test[i].reshape(28, 28))
    plt.gray()
    ax.get_xaxis().set_visible(False)
    ax.get_yaxis().set_visible(False)
    if i == n/2:
        ax.set_title('Original Images')

    # plot noisy image 
    ax = plt.subplot(2, n, i + 1 + n)
    plt.imshow(x_test_noisy[i].reshape(28, 28))
    plt.gray()
    ax.get_xaxis().set_visible(False)
    ax.get_yaxis().set_visible(False)
    if i == n/2:
        ax.set_title('Noisy Input')
        
```

<div class="output display_data">

<img src="/outputs/image/5160fd47256ec574ce7ed3f74a350dcff1924909.png" width="575" height="247" />

</div>

</div>

> MODEL 

<div class="cell code" execution_count="14">

``` python
input_size = 784
hidden_size = 128
code_size = 32

input_img = Input(shape=(input_size,))
hidden_1 = Dense(hidden_size, activation='relu')(input_img)
code = Dense(code_size, activation='relu')(hidden_1)
hidden_2 = Dense(hidden_size, activation='relu')(code)
output_img = Dense(input_size, activation='sigmoid')(hidden_2)

autoencoder = Model(input_img, output_img)
autoencoder.compile(optimizer='adam', loss='binary_crossentropy')
autoencoder.fit(x_train_noisy, x_train, epochs=10)
```

<div class="output stream stdout">

    Epoch 1/10
    1875/1875 [==============================] - 7s 2ms/step - loss: 0.2093
    Epoch 2/10
    1875/1875 [==============================] - 3s 2ms/step - loss: 0.1309
    Epoch 3/10
    1875/1875 [==============================] - 4s 2ms/step - loss: 0.1219
    Epoch 4/10
    1875/1875 [==============================] - 3s 2ms/step - loss: 0.1181
    Epoch 5/10
    1875/1875 [==============================] - 3s 2ms/step - loss: 0.1161
    Epoch 6/10
    1875/1875 [==============================] - 5s 2ms/step - loss: 0.1143
    Epoch 7/10
    1875/1875 [==============================] - 5s 2ms/step - loss: 0.1132
    Epoch 8/10
    1875/1875 [==============================] - 4s 2ms/step - loss: 0.1124
    Epoch 9/10
    1875/1875 [==============================] - 3s 2ms/step - loss: 0.1115
    Epoch 10/10
    1875/1875 [==============================] - 4s 2ms/step - loss: 0.1113

</div>

<div class="output execute_result" execution_count="14">

    <keras.callbacks.History at 0x7fc570466790>

</div>

</div>

> PLOTING DATA

<div class="cell code" execution_count="15">

``` python
n = 5
plt.figure(figsize=(10, 7))

images = autoencoder.predict(x_test_noisy)

for i in range(n):
    # plot original image
    ax = plt.subplot(3, n, i + 1)
    plt.imshow(x_test[i].reshape(28, 28))
    plt.gray()
    ax.get_xaxis().set_visible(False)
    ax.get_yaxis().set_visible(False)
    if i == n/2:
        ax.set_title('Original Images')

    # plot noisy image 
    ax = plt.subplot(3, n, i + 1 + n)
    plt.imshow(x_test_noisy[i].reshape(28, 28))
    plt.gray()
    ax.get_xaxis().set_visible(False)
    ax.get_yaxis().set_visible(False)
    if i == n/2:
        ax.set_title('Noisy Input')
        
    # plot noisy image 
    ax = plt.subplot(3, n, i + 1 + 2*n)
    plt.imshow(images[i].reshape(28, 28))
    plt.gray()
    ax.get_xaxis().set_visible(False)
    ax.get_yaxis().set_visible(False)
    if i == n/2:
        ax.set_title('Autoencoder Output')
```

<div class="output display_data">

<img src="/outputs/image/4da8934c34edbe1dd626a663aa6b5936ce3c5ae3.png" width="575" height="382" />

</div>

</div>

> WEIGHT VISUALIZATION 

<div class="cell code" execution_count="16">

``` python
weights = autoencoder.get_weights()[0].T

n = 10
plt.figure(figsize=(20, 5))
for i in range(n):
    ax = plt.subplot(1, n, i + 1)
    plt.imshow(weights[i+0].reshape(28, 28))
    ax.get_xaxis().set_visible(False)
    ax.get_yaxis().set_visible(False)
    
```

<div class="output display_data">

<img src="/outputs/image/1ce2c2e6d1691f626939203dee772804d4325780.png" width="1133" height="112" />

</div>

</div>

> THANKS

