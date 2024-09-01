import React, { useState, useEffect } from 'react';
import { Piano, MidiNumbers } from 'react-piano';
import 'react-piano/dist/styles.css';
import { Sun, Moon } from 'lucide-react';
import './PianoStyles.css';

const chordIntervals = {
  major: [0, 4, 7],
  minor: [0, 3, 7]
};

const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const guitarChords = {
  major: {
    C: ['x', '3', '2', '0', '1', '0'],
    'C#': ['x', '4', '3', '1', '2', '1'],
    D: ['x', 'x', '0', '2', '3', '2'],
    'D#': ['x', '6', '5', '3', '4', '3'],
    E: ['0', '2', '2', '1', '0', '0'],
    F: ['1', '3', '3', '2', '1', '1'],
    'F#': ['2', '4', '4', '3', '2', '2'],
    G: ['3', '2', '0', '0', '0', '3'],
    'G#': ['4', '6', '6', '5', '4', '4'],
    A: ['x', '0', '2', '2', '2', '0'],
    'A#': ['x', '1', '3', '3', '3', '1'],
    B: ['x', '2', '4', '4', '4', '2']
  },
  minor: {
    C: ['x', '3', '5', '5', '4', '3'],
    'C#': ['x', '4', '6', '6', '5', '4'],
    D: ['x', 'x', '0', '2', '3', '1'],
    'D#': ['x', '6', '8', '8', '7', '6'],
    E: ['0', '2', '2', '0', '0', '0'],
    F: ['1', '3', '3', '1', '1', '1'],
    'F#': ['2', '4', '4', '2', '2', '2'],
    G: ['3', '5', '5', '3', '3', '3'],
    'G#': ['4', '6', '6', '4', '4', '4'],
    A: ['x', '0', '2', '2', '1', '0'],
    'A#': ['x', '1', '3', '3', '2', '1'],
    B: ['x', '2', '4', '4', '3', '2']
  }
};

const GuitarChordDiagram = ({ chord, darkMode, noteNames }) => {
    const svgWidth = 150;
    const svgHeight = 230;
    const stringSpacing = svgWidth / 6;
    const fretSpacing = svgHeight / 6;
  
    const strokeColor = darkMode ? 'white' : 'black';
    const fillColor = darkMode ? 'black' : 'white';
  
    const getNoteNameForString = (stringIndex, fret) => {
      const openStringNotes = ['E', 'A', 'D', 'G', 'B', 'E'];
      if (fret === 'x') return '';
      const semitones = parseInt(fret);
      const startNote = noteNames.indexOf(openStringNotes[stringIndex]);
      return noteNames[(startNote + semitones) % 12];
    };
  
    return (
      <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
        <line x1="0" y1={fretSpacing} x2={svgWidth} y2={fretSpacing} stroke={strokeColor} strokeWidth="4" />
        
        {[1, 2, 3, 4].map((fret) => (
          <line key={`fret-${fret}`} x1="0" y1={fretSpacing * (fret + 1)} x2={svgWidth} y2={fretSpacing * (fret + 1)} stroke={strokeColor} strokeWidth="2" />
        ))}
        
        {[0, 1, 2, 3, 4, 5].map((string) => (
          <line key={`string-${string}`} x1={stringSpacing * (string + 0.5)} y1={fretSpacing} x2={stringSpacing * (string + 0.5)} y2={fretSpacing * 5} stroke={strokeColor} strokeWidth="1" />
        ))}
  
        {/* Orientation dot */}
        <circle cx={svgWidth / 2} cy={fretSpacing * 3.5} r="4" fill={darkMode ? "#666" : "#999"} />
  
        {chord.map((position, index) => {
          if (position === 'x') {
            return (
              <text key={`position-${index}`} x={stringSpacing * (index + 0.5)} y={fretSpacing * 0.7} textAnchor="middle" fontSize="20" fill={strokeColor}>
                ×
              </text>
            );
          } else if (position === '0') {
            return (
              <React.Fragment key={`position-${index}`}>
                <circle cx={stringSpacing * (index + 0.5)} cy={fretSpacing * 0.5} r="8" stroke={strokeColor} strokeWidth="1" fill="none" />
                <text x={stringSpacing * (index + 0.5)} y={svgHeight - 15} textAnchor="middle" fontSize="12" fill={strokeColor}>
                  {getNoteNameForString(index, position)}
                </text>
              </React.Fragment>
            );
          } else {
            const fretPosition = parseInt(position);
            return (
              <React.Fragment key={`position-${index}`}>
                <circle cx={stringSpacing * (index + 0.5)} cy={fretSpacing * (fretPosition - 0.5 + 1)} r="8" fill={strokeColor} />
                <text x={stringSpacing * (index + 0.5)} y={svgHeight - 15} textAnchor="middle" fontSize="12" fill={strokeColor}>
                  {getNoteNameForString(index, position)}
                </text>
              </React.Fragment>
            );
          }
        })}
      </svg>
    );
  };
    
const ChordDisplay = () => {
  const [selectedChord, setSelectedChord] = useState('C');
  const [isMinor, setIsMinor] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const chordType = isMinor ? 'minor' : 'major';

  const firstNote = MidiNumbers.fromNote('c4');
  const lastNote = MidiNumbers.fromNote('b5');

  useEffect(() => {
    document.body.classList.add('dark-mode');
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const toggleMinor = () => {
    setIsMinor(!isMinor);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const displayChord = isMinor ? selectedChord + 'm' : selectedChord;

  const getChordNotes = (root, type) => {
    const rootIndex = noteNames.indexOf(root);
    return chordIntervals[type].map(interval => 
      (rootIndex + interval) % 12 + 60 + Math.floor((rootIndex + interval) / 12) * 12
    );
  };

  const activeNotes = getChordNotes(selectedChord, chordType);

  const renderNoteLabel = ({ keyWidth, midiNumber, isActive, isAccidental }) => {
    if (!isActive) return null;
    const noteName = noteNames[midiNumber % 12];
    return (
      <div className="ReactPiano__NoteLabelContainer">
        {noteName}
      </div>
    );
  };

  return (
    <div style={{ margin: '0 0.5in', position: 'relative' }}>
      <button 
        onClick={toggleDarkMode} 
        style={{ 
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '5px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {darkMode ? <Sun color="var(--text-color)" size={24} /> : <Moon color="var(--text-color)" size={24} />}
      </button>

      <h1>Interactive Chord Display</h1>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px' }}>
        {noteNames.map((note) => (
          <button 
            key={note} 
            onClick={() => setSelectedChord(note)}
            style={{ 
              padding: '5px', 
              backgroundColor: selectedChord === note ? 'var(--highlight-color)' : 'var(--button-bg)',
              color: 'var(--button-text)',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              cursor: 'pointer',
              width: '40px'
            }}
          >
            {note}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={toggleMinor} 
          style={{ 
            padding: '5px 10px', 
            backgroundColor: 'var(--button-bg)',
            color: 'var(--button-text)',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {isMinor ? 'Switch to Major' : 'Switch to Minor'}
        </button>
      </div>

      <div>
        <h2>Piano - {displayChord} Chord</h2>
        <div style={{ pointerEvents: 'none' }}>
          <Piano
            noteRange={{ first: firstNote, last: lastNote }}
            playNote={() => {}}
            stopNote={() => {}}
            width={700}
            activeNotes={activeNotes}
            renderNoteLabel={renderNoteLabel}
          />
        </div>
      </div>

      <div style={{ marginTop: '20px', width: '200px' }}>
        <h2 style={{ marginBottom: '10px', whiteSpace: 'nowrap' }}>Guitar - {displayChord} Chord</h2>
        <GuitarChordDiagram 
          chord={guitarChords[chordType][selectedChord]}
          darkMode={darkMode}
          noteNames={noteNames}
        />
      </div>
    </div>
  );
};

export default ChordDisplay;