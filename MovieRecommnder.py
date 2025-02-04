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
#print(rating.head())
#print(movies.head())


#merges the data based on the entries in column MovieId
totdata = pd.merge(rating, movies, on='movieId')
#print(totdata.head())

#making a pivot table
UserPivotTable = pd.pivot_table(totdata, index='userId', columns='title', values='rating', fill_value=0)
#print(UserPivotTable)

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

#converting the given pivot matrix into a sparse matrix as it is of large size and is of mostly zeros
UserSparseMat = csr_matrix(UserPivotTable.values)

#using the sparse matrix we can perform the svd to get our components 
u, sigma, vtranspose = svds(UserSparseMat, k=50)
sigma = np.diag(sigma)

#reconstructing the matrix with the new sigma to ensure we can use the predictions
PredictedRating = np.dot(np.dot(u, sigma), vtranspose)
#print(PredictedRating)


#building the actual recommendation function 
def Get_Recommendations(title, cosine_sim = cosineSim):
    # Check if the title exists
    if title not in movies['title'].values:
        print(f"Movie '{title}' not found in the dataset.")
        return
    
    #get the id of movies with the title provided
    ids = movies[movies['title'] == title].index[0]
    
    #we make a sim score of all the ids with the same id using the cosine_sim function
    sim_score = list(enumerate(cosine_sim[ids]))
    
    #sorting the scores in non-increasing order
    sim_score = sorted(sim_score, key=lambda x : x[1], reverse=True)
    
    #we take the first 10 recommendations based on the sim score
    sim_score = sim_score[1:11]
    
    #we iterate through all the movie names 
    movies_ind = [i[0] for i in sim_score]
    
    #checking the indeces
    #print(movies_ind)
    
    #recommendations which are written in a list
    recs = movies['title'].iloc[movies_ind].values
    
    #printing all the top recommendations
    print(f"Recommendations are : \n")
    for name in recs:
        print(name)
        
#Taking the inputs from the user
MovName = str(input("Enter name of the film you already like: "))
MovYear = str(input("Enter the year of the film's release: "))

#making the proper input for the recommendation algo
fullMovieName = MovName + " (" + MovYear + ")"

#Using the aformentioned recommender
Get_Recommendations(fullMovieName)