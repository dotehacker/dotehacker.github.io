# Multi_Class_Text_Classification



# Multi_Class_Text_Classification
> **This post and code are used in a challenge organized by LOCUS called DataRush.**

![](/posts/text_processing/photo/data_wall.png)

Hi!, Today in this post i am going to share our effort which was applied by us in a competition organized by LOCUS.

Lets start, for this challenge we have give data sets which contain a train data csv which contain four columns and 390603 rows ie ``` 390603 rows × 4 columns ```. As in each row we have given '*id*' number( which is random id number to represent id), '**abstract**' which contain main part for this competition which we have to classify.(Abstract :: It is the initial paragraph of the research paper which used to define the character and overview of research paper), '**category**' this contain the category on which we have to classify the abstract data. and last column contain '**category_num**' of respective category.
```python
df_train
```
![](/posts/text_processing/photo/sample_data.png)

<pre>
 	id 	abstract 	category 	category_num
0 	271675 	Bacteria are often exposed to multiple stimu... 	q-bio-QM 	138
1 	412276 	Accurate knowledge of the thermodynamic prop... 	hep-ph- 	68
2 	256956 	The largest X9.3 solar flare in solar cycle ... 	astro-ph-SR 	7
3 	427612 	We say that a random integer variable $X$ is... 	math-PR 	93
4 	113852 	We derive a formula expressing the joint dis... 	math-CO 	76
... 	... 	... 	... 	...
390598 	479582 	Axion-like particles (ALPs) are hypothetical... 	hep-ph- 	68
390599 	99488 	Due to ever increasing usage of wireless dev... 	eess-SP 	62
390600 	157301 	Weight and activation binarization is an eff... 	cs-CV 	25
390601 	209221 	Large-scale unconstrained optimization is a ... 	math-OC 	92
390602 	482651 	In this report, we discuss the dynamics of p... 	gr-qc- 	65

390603 rows × 4 columns
</pre>

## Data visualization

From EDA we have found that this data sets is so imblance. Some of the sample are one in number then other are of thousand in number. This add so complex in data classificatio.
See what we found on category:-
```python
plt.figure(figsize=(25,4))
df_train['category'].value_counts().plot(kind='bar')
plt.axis()
plt.show()
```
![](/posts/text_processing/photo/train_data_number.png)

and similar things we found for test data.
![](/posts/text_processing/photo/test_data_number.png)
as all things in image we are unable to figure out how differ they are the we amnually plot number of data for each classes, then we socked from the results. We found two dat sample are of only one category, Shit.
```python
catetr=df_train['category'].value_counts()
catetr
```
<pre>
cs-LG        23414
cs-CV        22943
quant-ph-    14561
cs-CL        11143
hep-ph-      10863
             ...  
q-fin-EC        17
astro-ph-        7
q-alg-           2
alg-geom-        1
funct-an-        1
Name: category, Length: 156, dtype: int64
</pre>

## Data Processing

Here we have done stemmerming which makes shorten the word by removing the suffices and other letter which are added in the last of the sentence. Instead of lemmatization we have done stremmerming because stremmerming reduce the size of the words and preserve the manner and inner logics of the sentence. Here, we have used porterStemmer of NLTK library. ALong with that we have also removed some of the regular expression, puncutation, letter and replacing the comma by next line and we have also removed some of the stops word which is in this sentence, by making all sentence letter in lower case.That is passed through all data train test and validation data.

```python
# for stemmer

ps = PorterStemmer()

# function for data cleaning like regular expression punctuation lowering all to lower case removing stop words etc

def clean_abstract(text):
  text = re.sub('[^a-z\s]', ' ', text.lower())
  text = [i.lower() for i in text.split() if i not in nlp.Defaults.stop_words]
  text = [ps.stem(i) for i in text]
  text = ' '.join(text)
  text.replace('\n',' ')
  return text

# cleaning train data
df_train['abstract'] = df_train['abstract'].apply(clean_abstract)  

# cleaning test data

df_test['abstract'] = df_test['abstract'].apply(clean_abstract)

# cleaning val  data

df_val['abstract'] = df_val['abstract'].apply(clean_abstract)


X_train, y_train = df_train['abstract'],df_train['category']
X_val, y_val = df_val['abstract'],df_val['category']
X_test= df_test['abstract']
```

  

## Text Vectorization

### TFID

### CountVectorizer

## Model for Data Generation

## Machine Learning

### SVC

### Logistics Regression

### KNN

### MultinomialNB

## Data Balancing

### Over Sampling

### Under Sampling

#### Machine Learning

##### SVC

##### Logistics Regression

##### KNN

##### MultinomialNB

##### Ensemble

##### other model

## NLTK

## NN

## BERT

## Multi Layer Neural Network

## CNN 

## LSTM 

## Confusion Matrix

## SUBMISSION

## Conclusion






