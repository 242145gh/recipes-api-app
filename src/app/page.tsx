"use client"
import React, { useEffect, useState, useRef } from "react";
import {Slide, toast } from "react-toastify";

const debounce = (func, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [recipeUrls, setRecipeUrls] = useState([]);
  const [sourceUrls, setSourceUrls] = useState([]); // Added state for recipe source URLs
  const [theme, setTheme] = useState("pink");
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    abortControllerRef.current = new AbortController();

    const fetchRecipes = debounce(async () => {
      const { signal } = abortControllerRef.current;

      try {
        if (query.trim() === '') {
          // Don't make a request if the query is empty
          return;
        }

        const response = await fetch(
          `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=5&apiKey=488247ec386f4496b555c268f9358c16`,
          { signal }
        );

        if (!response.ok) {
          
          toast('🦄 402 used all requests', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Slide,
            });
          
          throw new Error(`HTTP error! Status: ${response.status}`);

       
        }

        const data = await response.json();

        setRecipes(data.results);

        // Fetch recipe URLs for each recipe
        const urls = data.results.map(recipe => (
          `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=488247ec386f4496b555c268f9358c16`
        ));
        setRecipeUrls(urls);

        // Fetch source URLs for each recipe
        const sourceData = await Promise.all(
          urls.map(url => fetch(url, { signal }).then(response => response.json()))
        );

        const sourceUrls = sourceData.map(data => data.sourceUrl);
        console.debug(sourceUrls);
        setSourceUrls(sourceUrls);

        setHighlightedIndex(-1);
      } catch (error) {
        console.error('Error:', error.message);
      }
    }, 500);

    fetchRecipes();

    return () => {
      // Cleanup: Cancel the previous request when a new query is initiated
      abortControllerRef.current.abort();
    };
  }, [query]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "pink" : "dark";
    document.querySelector("html").setAttribute("data-theme", newTheme);
    setTheme(newTheme);
  };

  const handleClear = () => {
    setQuery('');
    setRecipes([]);
    setRecipeUrls([]);
    setSourceUrls([]);
    setHighlightedIndex(-1);
  };

  return (
    <>
      <main
        className={`flex min-h-screen flex-col items-center justify-between p-24 ${
          theme === "pink" ? "bg-gradient-to-b from-sky-400 to-pink-900" : ""
        }`}
      >
        <div className="search-container">
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered input-lg w-full max-w-xs mb-4"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
         <button className="btn btn-lg btn-info ml-4" onClick={handleClear}>
            {(query || sourceUrls.length > 0) ? (
                <span className="loading loading-spinner"></span>
            ) : (
                'Clear'
            )}
            
            </button>
        </div>

        <div className="autocomplete-list">
          {recipes.map((recipe, index) => (
            <div
              key={recipe.id}
              className={`autocomplete-item ${
                highlightedIndex === index ? "highlighted" : ""
              }`}
            >
              <a target="_blank" href={sourceUrls[index]}>
                <h2>{recipe.title}</h2>
              </a>
            </div>
          ))}
        </div>

        <label htmlFor="themeToggle">
          <input
            type="checkbox"
            id="themeToggle"
            className="toggle toggle-accent"
            checked={theme === "pink"}
            onChange={toggleTheme}
          />
        </label>
      </main>
    </>
  );
}
