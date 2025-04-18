import React from 'react';

export default function StoriesWorking() {
  return (
    <div style={{
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: 'white',
      minHeight: '100vh'
    }}>
      <h1 style={{
        color: '#333',
        textAlign: 'center'
      }}>
        Stories Page
      </h1>
      
      <div style={{
        backgroundColor: '#f0f0f0',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#444' }}>Featured Story</h2>
        <div style={{
          backgroundColor: '#fff',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#555', marginTop: 0 }}>The Whispering Forest</h3>
          <p style={{ color: '#666' }}>A walk through a magical, quiet woodland.</p>
          <button style={{
            backgroundColor: '#4a90e2',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Play Now
          </button>
        </div>
      </div>
      
      <div style={{
        backgroundColor: '#f0f0f0',
        padding: '20px',
        borderRadius: '8px'
      }}>
        <h2 style={{ color: '#444' }}>More Stories</h2>
        <ul style={{
          listStyle: 'none',
          padding: 0
        }}>
          {['Starlit Dreams', 'Ocean Whispers', 'Mountain Serenity'].map((title, index) => (
            <li key={index} style={{
              backgroundColor: '#fff',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '10px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <h3 style={{ color: '#555', margin: '0 0 5px 0' }}>{title}</h3>
                <p style={{ color: '#666', margin: 0 }}>15 min</p>
              </div>
              <button style={{
                backgroundColor: '#4a90e2',
                color: 'white',
                border: 'none',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}>
                ▶
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      <div style={{
        marginTop: '20px',
        backgroundColor: '#f0f0f0',
        padding: '20px',
        borderRadius: '8px'
      }}>
        <h2 style={{ color: '#444' }}>Navigation</h2>
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginTop: '10px'
        }}>
          <button style={{
            backgroundColor: '#4a90e2',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Home
          </button>
          <button style={{
            backgroundColor: '#4a90e2',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Library
          </button>
          <button style={{
            backgroundColor: '#4a90e2',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Profile
          </button>
        </div>
      </div>
    </div>
  );
}
