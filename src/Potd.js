/*global chrome*/
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Potd = () => {
    const [data, setData] = useState(null);

    const fetchData = async () => {
        try {
            const today = new Date().toISOString().slice(0, 10); // Get the current date in 'YYYY-MM-DD' format

            chrome.storage.sync.get(["potdData"], (result) => {
                const cachedData = JSON.parse(result.potdData ? result.potdData : null);
                if (cachedData && cachedData.date === today) {
                    // Use the cached data
                    setData(cachedData);
                    console.log('served cached data');
                } else {
                    // Fetch new data from the API
                    axios.get('https://the-leetcode-api.onrender.com/graphql-query')
                        .then((response) => {
                            const newData = { ...response.data, date: today };

                            chrome.storage.sync.set({ 'potdData': JSON.stringify(newData) }, () => {
                                // console.log("Value is set");
                            });
                            setData(newData);
                        })
                        .catch((error) => {
                            console.error('Failed to fetch data:', error);
                        });
                }
            });
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };
    // const fetchData = async () => {
    //     try {
    //         const today = new Date().toISOString().slice(0, 10); // Get the current date in 'YYYY-MM-DD' format

    //         const cachedDataJSON = localStorage.getItem("potdData");
    //         if (cachedDataJSON) {
    //             const cachedData = JSON.parse(cachedDataJSON);
    //             if (cachedData.date === today) {
    //                 // Use the cached data
    //                 setData(cachedData);
    //                 return;
    //             }
    //         }

    //         // Fetch new data from the API
    //         axios.get('https://the-leetcode-api.onrender.com/graphql-query')
    //             .then((response) => {
    //                 const newData = { ...response.data, date: today };
    //                 localStorage.setItem('potdData', JSON.stringify(newData));
    //                 setData(newData);
    //             })
    //             .catch((error) => {
    //                 console.error('Failed to fetch data:', error);
    //             });
    //     } catch (error) {
    //         console.error('Failed to fetch data:', error);
    //     }
    // };




    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className='potd-container'>
            {data ? (
                <>
                    <a className='potd-title' href={data.leetcodeLink}>{data.title}</a>
                    <p className='potd-diff'>{data.difficulty}</p>
                    <div className='potd-categories'>
                        {data.topicTags.map((topic) => {
                            return (
                                <span key={topic.id} className='potd-diff'>
                                    {topic.name}
                                </span>
                            );
                        })}
                    </div>
                    <div
                        className='potd-html'
                        dangerouslySetInnerHTML={{ __html: data.problemDescHTML }}
                    />
                </>
            ) : (
                <h1>Loading...</h1>
            )}
        </div>
    );
};

export default Potd;
