/*global chrome*/
import React, { useState, useEffect } from 'react';
import './App.css';
import Potd from './Potd';

const Home = () => {
  const [quickLinks, setQuickLinks] = useState([]);
  const [url, setUrl] = useState('');
  const [alias, setAlias] = useState('');

  useEffect(() => {
    const storedQuickLinks = localStorage.getItem('quickLinks');
    if (storedQuickLinks) {
      setQuickLinks(JSON.parse(storedQuickLinks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('quickLinks', JSON.stringify(quickLinks));
  }, [quickLinks]);

  // Load quick links from chrome.storage.sync when the component mounts
  // useEffect(() => {
  //   chrome.storage.sync.get(['quickLinks'], (result) => {
  //     const storedQuickLinks = result.quickLinks;
  //     if (storedQuickLinks) {
  //       setQuickLinks(JSON.parse(storedQuickLinks));
  //     }
  //   });
  // }, []);

  // // Save quick links to chrome.storage.sync whenever it changes
  // useEffect(() => {
  //   chrome.storage.sync.set({ quickLinks: JSON.stringify(quickLinks) });
  // }, [quickLinks]);

  const handleAddQuickLink = () => {
    if (url && alias) {
      const newQuickLink = { url, alias };
      setQuickLinks((prevQuickLinks) => [...prevQuickLinks, newQuickLink]);
      setUrl('');
      setAlias('');
    }
  };

  const handleEditQuickLink = (index, newAlias) => {
    const updatedQuickLinks = [...quickLinks];
    updatedQuickLinks[index].alias = newAlias;
    setQuickLinks(updatedQuickLinks);
  };

  const handleDeleteQuickLink = (index) => {
    const updatedQuickLinks = quickLinks.filter((_, i) => i !== index);
    setQuickLinks(updatedQuickLinks);
  };

  return (
    <div className="home-container">
      <Potd />
      <div>
        <div className="add-quick-link-form">
          <input
            id="img-url-input"
            autoFocus
            type="url"
            placeholder="PROPER URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                document.querySelector('#alias-input').focus();
                e.preventDefault();
              }
            }}
          />
          <input
            id="alias-input"
            type="text"
            placeholder="Alias"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                document.querySelector('#img-url-input').focus();
                handleAddQuickLink();
                e.preventDefault();
              }
            }}
          />
        </div>
        <div className="quick-links">
          {quickLinks.map((link, index) => (
            <div className="link-delete-integrate">
              <div
                key={index}
                onClick={() => window.location.replace(link.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="quick-link-button"
              >
                <span>{link.alias}</span>
                <div className="task-icons">
                  <i
                    className="fas fa-edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      const newAlias = prompt('Edit alias:', link.alias);
                      if (newAlias !== null) {
                        handleEditQuickLink(index, newAlias);
                      }
                    }}
                  ></i>
                </div>
              </div>
              <i
                className="fa fa-trash my-trash"
                aria-hidden="true"
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteQuickLink(index);
                }}
              ></i>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
