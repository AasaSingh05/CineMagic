# 🎟️ Movie Recommendation System

This project is a **Movie Recommendation System** that leverages **collaborative filtering** and **content-based filtering** techniques to suggest movies to users based on their preferences. 🎥🌟

## 📚 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [How It Works](#how-it-works)
- [Example](#example)
- [Future Enhancements](#future-enhancements)
- [License](#license)

## 📅 Overview
This system recommends movies based on two techniques:
1. **Content-Based Filtering** 🔍: Recommends movies with similar genres using **TF-IDF vectorization** and **cosine similarity**.
2. **Collaborative Filtering** 📊: Suggests movies based on user ratings using **Singular Value Decomposition (SVD)**.

## 🔧 Features
- Recommends movies similar to the ones you already like.
- Combines content and user-based filtering for accurate suggestions.
- Easy to use and customize.

## 🚀 Technologies Used
- **Python** 🖊️
- **NumPy** 📉
- **Pandas** 📊
- **SciPy** (for SVD and sparse matrices)
- **Scikit-learn** (for TF-IDF vectorization and cosine similarity)

## 📖 Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/movie-recommender.git
   cd movie-recommender
   ```

2. **Install the required packages:**
   ```bash
   pip install numpy pandas scipy scikit-learn
   ```

3. **Download the datasets:**
   Make sure `ratings.csv` and `movies.csv` from the [MovieLens dataset](https://grouplens.org/datasets/movielens/) are in the project directory.

## 🔄 Usage
1. Run the script using:
   ```bash
   python movie_recommender.py
   ```
2. Enter the name of a movie and its release year when prompted:
   ```
   Enter name of the film you already like: The Matrix
   Enter the year of the film's release: 1999
   ```
3. Get your top 10 movie recommendations! 🎬

## 🧐 How It Works
1. **Data Preprocessing:**
   - Merges `ratings.csv` and `movies.csv` on `movieId`.
   - Creates a user-movie pivot table.

2. **Content-Based Filtering:**
   - Uses **TF-IDF Vectorization** on the movie genres.
   - Computes **cosine similarity** between movies to find similar ones.

3. **Collaborative Filtering:**
   - Converts the pivot table to a sparse matrix.
   - Performs **Singular Value Decomposition (SVD)** to predict user ratings for unrated movies.

4. **Recommendation Generation:**
   - Retrieves the top 10 most similar movies based on cosine similarity.

## 🔹 Example
If you input **"The Matrix (1999)"**, you might get recommendations like:
- The Matrix Reloaded (2003)
- Inception (2010)
- The Terminator (1984)
- Minority Report (2002)
- Equilibrium (2002)

## 🌟 Future Enhancements
- 💡 Integrate with a web framework (e.g., Flask or Django) for a user-friendly interface.
- 🌐 Include more features like actors, directors, and keywords.
- 📊 Add more sophisticated collaborative filtering techniques.
- 🔔 Provide personalized recommendations based on user profiles.

## 📄 License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Happy Movie Watching! 🎥🍿
