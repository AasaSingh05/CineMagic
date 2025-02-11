import numpy as np
import pandas as pd
from scipy.sparse.linalg import svds
from scipy.sparse import csr_matrix
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import sys
import os

# Get the directory where the script is located
script_dir = os.path.dirname(os.path.abspath(__file__))

# Construct absolute paths to the CSV files
ratings_path = os.path.join(script_dir, "ratings.csv")
movies_path = os.path.join(script_dir, "movies.csv")

try:
    # Read CSV files
    rating = pd.read_csv(ratings_path)
    movies = pd.read_csv(movies_path)
    
    # Rest of your data processing code remains the same until the recommendation function
    totdata = pd.merge(rating, movies, on='movieId')
    UserPivotTable = pd.pivot_table(totdata, index='userId', columns='title', values='rating', fill_value=0)
    
    tfidf = TfidfVectorizer(stop_words='english')
    movies['genres'] = movies['genres'].fillna('')
    tfidf_mat = tfidf.fit_transform(movies['genres'])
    
    cosineSim = cosine_similarity(tfidf_mat, tfidf_mat)
    UserSim = cosine_similarity(UserPivotTable.fillna(0))
    UserSparseMat = csr_matrix(UserPivotTable.values)
    u, sigma, vtranspose = svds(UserSparseMat, k=50)
    sigma = np.diag(sigma)
    PredictedRating = np.dot(np.dot(u, sigma), vtranspose)

    def Get_Recommendations(title, cosine_sim = cosineSim):
        # Check if the title exists
        if title not in movies['title'].values:
            print(f"ERROR: Movie '{title}' not found in the dataset.")
            sys.exit(1)
        
        ids = movies[movies['title'] == title].index[0]
        sim_score = list(enumerate(cosine_sim[ids]))
        sim_score = sorted(sim_score, key=lambda x : x[1], reverse=True)
        sim_score = sim_score[1:11]
        movies_ind = [i[0] for i in sim_score]
        
        # Return recommendations as a simple list
        recs = movies['title'].iloc[movies_ind].values
        for name in recs:
            print(name)

    # Get command line arguments
    if len(sys.argv) != 3:
        print("ERROR: Incorrect number of arguments")
        sys.exit(1)

    movie_name = sys.argv[1]
    movie_year = sys.argv[2]
    full_movie_name = f"{movie_name} ({movie_year})"
    
    # Get recommendations
    Get_Recommendations(full_movie_name)

except FileNotFoundError as e:
    print(f"ERROR: Could not find required CSV files: {str(e)}")
    sys.exit(1)
except Exception as e:
    print(f"ERROR: An unexpected error occurred: {str(e)}")
    sys.exit(1)