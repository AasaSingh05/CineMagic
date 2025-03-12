import pandas as pd
import numpy as np
from scipy.sparse.linalg import svds
from scipy.sparse import csr_matrix
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from supabase import create_client
import os
import sys
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize Supabase client
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")
supabase = create_client(supabase_url, supabase_key)

# Get the directory where the script is located
script_dir = os.path.dirname(os.path.abspath(__file__))

# Construct absolute paths to the CSV files
ratings_path = os.path.join(script_dir, "ratings.csv")
movies_path = os.path.join(script_dir, "movies.csv")

try:
    # Read CSV files
    rating = pd.read_csv(ratings_path)
    movies = pd.read_csv(movies_path)
    
    # Merge ratings and movies data
    totdata = pd.merge(rating, movies, on='movieId')
    UserPivotTable = pd.pivot_table(totdata, index='userId', columns='title', values='rating', fill_value=0)
    
    # Compute cosine similarity matrix for movies
    tfidf = TfidfVectorizer(stop_words='english')
    movies['genres'] = movies['genres'].fillna('')
    tfidf_mat = tfidf.fit_transform(movies['genres'])
    cosineSim = cosine_similarity(tfidf_mat, tfidf_mat)
    
    # Compute user similarity and predicted ratings
    UserSim = cosine_similarity(UserPivotTable.fillna(0))
    UserSparseMat = csr_matrix(UserPivotTable.values)
    u, sigma, vtranspose = svds(UserSparseMat, k=50)
    sigma = np.diag(sigma)
    PredictedRating = np.dot(np.dot(u, sigma), vtranspose)

    def prepare_recommendations():
        all_recommendations = []
        
        for title in movies['title'].unique():
            ids = movies[movies['title'] == title].index[0]
            sim_score = list(enumerate(cosineSim[ids]))
            sim_score = sorted(sim_score, key=lambda x: x[1], reverse=True)
            sim_score = sim_score[1:11]
            movies_ind = [i[0] for i in sim_score]
            recs = movies['title'].iloc[movies_ind].values.tolist()
            
            all_recommendations.append({
                'movie_title': title,
                'recommended_movies': recs
            })
        
        # Insert recommendations into Supabase
        supabase.table('movie_recommendations').insert(all_recommendations).execute()

    if __name__ == "__main__":
        prepare_recommendations()

except FileNotFoundError as e:
    print(f"ERROR: Could not find required CSV files: {str(e)}")
    sys.exit(1)
except Exception as e:
    print(f"ERROR: An unexpected error occurred: {str(e)}")
    sys.exit(1)