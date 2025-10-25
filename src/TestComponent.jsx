import React, { useEffect } from 'react';

function SimpleTest() {
  useEffect(() => {
    console.log('✅ TestComponent mounted successfully');
    console.log('✅ React is working');
    console.log('✅ Component lifecycle is functioning');
  }, []);

  const handleClick = () => {
    console.log('✅ Event handlers working');
    alert('React is working! Click detected.');
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f9ff',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 style={{ color: '#059669', marginBottom: '20px' }}>
        🌱 Test Component Loaded Successfully
      </h1>
      <p style={{ color: '#374151', marginBottom: '20px' }}>
        If you can see this, React is working!
      </p>
      <button 
        onClick={handleClick}
        style={{
          padding: '10px 20px',
          backgroundColor: '#059669',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Click to test event handling
      </button>
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#6b7280' }}>
        <p>Debug info:</p>
        <ul style={{ textAlign: 'left' }}>
          <li>React version: {React.version}</li>
          <li>Component rendered at: {new Date().toLocaleTimeString()}</li>
          <li>Environment: {import.meta.env.MODE}</li>
        </ul>
      </div>
    </div>
  );
}

export default SimpleTest;