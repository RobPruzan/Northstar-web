


# Automatic literacy and speech assessment

<img width="1344" alt="image" src="https://user-images.githubusercontent.com/97781863/226501584-5e357f4a-878d-42c7-b97c-907a56a587ee.png">

Demo: https://huggingface.co/spaces/RobPruzan/automaticlitassesment

**Reading Difficulty**-  Automatically determining how difficult something is to read is a difficult task as underlying 
                 semantics are relevant. To efficiently compute text difficulty, a Distil-RoBERTa pre-trained model is fine-tuned for regression 
                 using The CommonLit Ease of Readability (CLEAR) Corpus. This model scores the text on how difficult it would be for a student
                 to understand. This model is trained end-end (regression layer down to the first attention layer to ensure the best performance- 
                 Merchant et al. 2020)
 
![image](https://user-images.githubusercontent.com/97781863/183447368-c2738b41-d6e2-40bd-8f74-99c09e3e5054.png)


**Lexical Diversity**-  The lexical diversity score is computed by taking the ratio of unique similar words to total similar words 
                  squared. The similarity is computed as if the cosine similarity of the word2vec embeddings is greater than .75. It is bad writing/speech 
                  practice to repeat the same words when it's possible not to. Vocabulary diversity is generally computed by taking the ratio of unique 
                  strings/ total strings. This does not give an indication if the person has a large vocabulary or if the topic does not require a diverse 
                  vocabulary to express it. This custom algorithm only scores the text based on how many times a unique word was chosen for a semantic idea, e.g., 
                  "Forest" and "Trees" are 2 words to represent one semantic idea, so this would receive a 100% lexical diversity score, vs using the word
                  "Forest" twice would yield you a 25% diversity score, (1 unique word/ 2 total words)^2
                  
<img width="691" alt="image" src="https://user-images.githubusercontent.com/97781863/209993956-2d92cf0b-516f-4634-8313-e09f86e4c9ad.png">


                                  
**Speech Pronunciation Scoring-**-  The Wave2Vec 2.0 model is utilized to convert audio into text in real-time. The model predicts words or phonemes
                  (smallest unit of speech distinguishing one word (or word element) from another) from the input audio from the user. Due to the nature 
                  of the model, users with poor pronunciation get inaccurate results. This project attempts to score pronunciation by asking a user to read 
                  a target excerpt into the  microphone. We then pass this audio through Wave2Vec to get the inferred intended words. We measure the loss as 
                  the Levenshtein distance between the target and actual transcripts- the Levenshtein distance between two words is the minimum number of single-                         character edits required to change one word into the other.

**Synonym Generation**- To automaically generate reading-level based synoynms, word occurence statistics are calculated in different levels of reading
                   (defined by the fine-tuned DistilBert model). Based on those statistics we can derive what words are most likely to occur in different levels
                   of reading. To generate synoynms, the WordNet lexical database is used, which are then catarogized by the word occurence statistics and reccomended
                  
