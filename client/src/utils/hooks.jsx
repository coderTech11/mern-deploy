import axios from "axios";
import { useState, useEffect } from "react";

const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  //api call in this useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(url);
        setData(data);
        setIsLoading(false);
      } catch (error) {
        setError(true);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  return { data, isLoading, error };
};

export { useFetch };
