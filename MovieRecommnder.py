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