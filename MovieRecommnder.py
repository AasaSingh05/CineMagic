#importing all the necessary modules
import numpy as np
import pandas as pd
from scipy.sparse.linalg import svds
from scipy.sparse import csr_matrix
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

#to import all the csv files
rating = pd.read_csv("ratings.csv")
movies = pd.read_csv("movies.csv")

#to check if the import is proper by printing
print(rating.head())
print(movies.head())


#merges the data based on the entries in column MovieId
totdata = pd.merge(rating, movies, on='movieId')
#print(totdata.head())

#making a pivot table
UserPivotTable = pd.pivot_table(totdata, index='userId', columns='title', values='rating', fill_value=0)
print(UserPivotTable)

#recommendation algorithm
'''
- We use the tf-idf vectorization to convert the genres of the various movies into numerical values
- we calcuate how close the values are using cosine similarity (can use k means clustering too tho na? would work or not?)
- We recommend the movie based on how close the movie is to current movie
'''

#performing the TF-IDF vectorization of all the genres in movies
tfidf = TfidfVectorizer(stop_words='english')
movies['genres'] = movies['genres'].fillna('')
tfidf_mat = tfidf.fit_transform(movies['genres'])

#performing the cosine similarity\
#for the simillarity between the tfidf matrices 
cosineSim = cosine_similarity(tfidf_mat, tfidf_mat)
#print(cosineSim)

#for performing the similarity between the users itself
UserSim = cosine_similarity(UserPivotTable.fillna(0))
#print(UserSim)

