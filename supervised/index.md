# Unsupervised


***
# VAE
> VAE TYPES

## Auto Encoder

#### This is like a simple generative algorithm in which one model is used to reduce the data like simple compression and other is for increasing data like decompressor. This model contain different neural network model for both of task. Here there is difficult to develop or generate determined image from compressed laten space.

## Variational Autoencoders

#### Up to now, we have discussed dimensionality reduction problem and introduce autoencoders that are encoder-decoder architectures that can be trained by gradient descent. Let’s now make the link with the content generation problem, see the limitations of autoencoders in their current form for this problem and introduce Variational Autoencoders.
* Limitations of autoencoders for content generation *
#### At this point, a natural question that comes in mind is “what is the link between autoencoders and content generation?”. Indeed, once the autoencoder has been trained, we have both an encoder and a decoder but still no real way to produce any new content. At first sight, we could be tempted to think that, if the latent space is regular enough (well “organized” by the encoder during the training process), we could take a point randomly from that latent space and decode it to get a new content. The decoder would then act more or less like the generator of a Generative Adversarial Network.

![VAE](/vae.png)

 ***
 How data is generated in VAE.
 ![Auto Encoder vs VAE](https://miro.medium.com/max/2000/1*ejNnusxYrn1NRDZf4Kg2lw@2x.png "autoencoder vs VAE")
 
 ![LOSS FUNCTION](https://miro.medium.com/max/1400/1*Q5dogodt3wzKKktE0v3dMQ@2x.png "LOSS FOR VAE WITH REGULARISATION")
 
# GAN

> GAN TYPES

