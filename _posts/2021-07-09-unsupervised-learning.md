---
title: "Unsupervised Learning"
date: 2021-07-09
category: "AI & ML"
tags: [Deep Learning, VAE, GAN, Generative Models, Unsupervised Learning]
---

## VAE Types

### Auto Encoder

This is like a simple generative algorithm in which one model is used to reduce the data (like simple compression) and another is used to expand it back (like a decompressor). This model contains different neural network models for both tasks. Here it is difficult to develop or generate a determined image from compressed latent space.

### Variational Autoencoders

Up to now, we have discussed the dimensionality reduction problem and introduced autoencoders that are encoder-decoder architectures that can be trained by gradient descent. Let's now make the link with the content generation problem, see the limitations of autoencoders in their current form for this problem, and introduce Variational Autoencoders.

**Limitations of autoencoders for content generation**

At this point, a natural question that comes to mind is "what is the link between autoencoders and content generation?". Indeed, once the autoencoder has been trained, we have both an encoder and a decoder but still no real way to produce any new content. At first sight, we could be tempted to think that, if the latent space is regular enough (well "organized" by the encoder during the training process), we could take a point randomly from that latent space and decode it to get a new content. The decoder would then act more or less like the generator of a Generative Adversarial Network.

![VAE](/posts/2021/07/09/unsupervised-learning/unsupervised-learning-vae.png)

---

How data is generated in VAE.

![Auto Encoder vs VAE](https://miro.medium.com/max/2000/1*ejNnusxYrn1NRDZf4Kg2lw@2x.png "autoencoder vs VAE")

![LOSS FUNCTION](https://miro.medium.com/max/1400/1*Q5dogodt3wzKKktE0v3dMQ@2x.png "LOSS FOR VAE WITH REGULARISATION")

## GAN

> GAN TYPES
