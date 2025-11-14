# Using the Audio Player

The Blendtune audio player provides professional-grade playback controls and real-time visualizations to help you audition music tracks.

## Player Overview

The audio player appears at the bottom of the screen (desktop) or as an overlay (mobile) when you select a track. It features:

- Playback controls (play, pause, seek)
- Volume control
- Real-time waveform visualization
- Frequency equalizer display
- Track information
- Progress indicator

## Player Controls

### Basic Playback

**Play/Pause Button**
- Click the play button to start playback
- Click pause to stop playback
- Keyboard shortcut: Spacebar (when player is focused)

**Seek Bar**
- Drag the progress indicator to jump to any position
- Click anywhere on the progress bar to seek
- Shows elapsed time and total duration

**Volume Control**
- Click the volume icon to access the slider
- Drag to adjust volume (0-100%)
- Click mute icon to silence audio
- Volume preference is saved across sessions

### Advanced Controls

**Playback Speed** (if available)
- Adjust tempo without changing pitch
- Useful for detailed listening

**Loop** (if available)
- Repeat the current track
- Loop specific sections

## Waveform Visualization

The waveform provides a visual representation of the audio track's amplitude over time.

### Features

**Interactive Waveform**
- Click anywhere on the waveform to seek to that position
- Waveform updates in real-time during playback
- Current position is highlighted

**Visual Information**
- **Amplitude**: Height shows loudness at each point
- **Color Coding**: Different colors may indicate different sections
- **Progress Indicator**: Moving playhead shows current position

### Using the Waveform

1. **Quick Navigation**
   - Identify quiet intros or dramatic builds visually
   - Jump to choruses or instrumental sections
   - Preview the track's dynamic range

2. **Precise Seeking**
   - Click exact positions for precise playback
   - Useful for finding specific moments
   - Better than dragging traditional seek bars

## Frequency Equalizer

The equalizer displays real-time frequency analysis during playback.

### Understanding the Display

**Frequency Bands**
- Low frequencies (bass) on the left
- Mid frequencies in the center
- High frequencies (treble) on the right

**Visualization**
- Bars animate in real-time
- Height indicates intensity at each frequency
- Helps identify instruments and timbres

### Practical Use

- **Bass-heavy tracks**: Higher bars on the left
- **Bright tracks**: Higher bars on the right
- **Balanced tracks**: Even distribution across frequencies

## Track Information Display

The player shows important metadata:

- **Track Title**: Name of the song
- **Artist/Creator**: Who made the track
- **Duration**: Total length (MM:SS)
- **Key**: Musical key (e.g., C major, A minor)
- **Tempo**: BPM (beats per minute)
- **Genre**: Music style/category

## Mobile vs Desktop Player

### Desktop Player
- Fixed position at bottom of screen
- Full-width waveform
- Side-by-side controls and visualizations
- Larger equalizer display

### Mobile Player
- Overlay that can be minimized
- Vertical layout for controls
- Swipe gestures for interaction
- Optimized for touch input

## Player Modes

### Minimized Mode (Mobile)
- Small bar showing basic info
- Tap to expand full player
- Continues playback in background

### Full Mode
- Complete visualization and controls
- All metadata visible
- Interactive waveform and equalizer

## Keyboard Shortcuts

When the player is active:

- **Spacebar**: Play/Pause
- **Left Arrow**: Seek backward 5 seconds
- **Right Arrow**: Seek forward 5 seconds
- **Up Arrow**: Increase volume
- **Down Arrow**: Decrease volume
- **M**: Mute/unmute

## Tips for Best Experience

### Audio Quality
- Use good headphones or speakers to appreciate audio quality
- Adjust volume to comfortable level
- Close other audio applications to prevent conflicts

### Visualization Performance
- Waveform renders after track loads
- Equalizer requires audio playback to display
- Complex visualizations may affect performance on older devices

### Navigation
- Use waveform for visual navigation
- Seek bar for precise time-based seeking
- Track metadata helps understand what you're hearing

## Troubleshooting

### Waveform Not Appearing
- Wait for track to fully load
- Check browser supports Canvas API
- Try refreshing the page

### Equalizer Not Moving
- Ensure track is playing (not paused)
- Check browser supports Web Audio API
- Try a different track

### Choppy Playback
- Check internet connection speed
- Close unnecessary browser tabs
- Lower quality settings if available

### Volume Issues
- Check system volume is not muted
- Verify browser allows audio playback
- Try different audio output device

## Advanced Features

### Range Request Streaming
- Blendtune uses HTTP range requests for efficient streaming
- Allows seeking to any position without downloading entire file
- Reduces bandwidth usage and improves responsiveness

### Web Audio API Integration
- Professional-grade audio processing
- Real-time frequency analysis
- Low-latency playback

### Offline Capabilities (PWA)
- Service worker caches player code
- Improved loading on repeat visits
- Some offline functionality when installed as PWA

## Next Steps

- Learn about [Filtering and Search](./03-filtering-search.md)
- Manage your preferences in [Account Management](./04-account-management.md)
- Check the [FAQ](./05-faq.md) for common questions
