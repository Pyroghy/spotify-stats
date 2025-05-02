# Spotify Stats App MVP TODO List

## Core Features
- [x] Spotify OAuth login using @spotify/web-api-ts-sdk
- [x] Stats page with:
  - [x] Top tracks
  - [x] Top artists
  - [x] Recently played tracks
  - [x] Audio features analysis
- [x] Time range selection (4 weeks, 6 months, all time)
- [x] Sorting options for tracks and artists

## Bug Fixes & Improvements
- [ ] Fix time display:
  - [ ] Convert total listening time from days to hours
  - [ ] Fix broken total listening time calculation
- [ ] Fix broken sections:
  - [ ] Fix Recently Played section functionality
  - [ ] Fix Audio Features section functionality
- [ ] Fix Genres section:
  - [ ] Fix missing images
  - [ ] Fix limited display (currently only shows 3 options)
  - [ ] Debug and fix underlying genre data issues
- [ ] Enhance Historical Data:
  - [ ] Add more detailed historical analysis
  - [ ] Improve data visualization and insights
- [ ] Add Artist Details:
  - [ ] Implement clickable artist cards
  - [ ] Add artist information page
  - [ ] Show artist statistics and related data

## Additional Stats Pages
- [ ] Listening Habits:
  - [ ] Time of day analysis
  - [ ] Day of week patterns
  - [ ] Seasonal listening trends
  - [ ] Listening streak tracking
- [ ] Track Analysis:
  - [ ] Tempo and key distribution
  - [ ] Popularity vs. obscurity
  - [ ] Language distribution
  - [ ] Song length preferences
- [ ] Artist Insights:
  - [ ] Artist location map
  - [ ] New vs. established artists
  - [ ] Artist collaboration network
  - [ ] Record label distribution
- [ ] Genre Deep Dive:
  - [ ] Genre mood analysis
  - [ ] Genre diversity score
  - [ ] Sub-genre breakdown
  - [ ] Genre correlation analysis
- [ ] Playlist Analytics:
  - [ ] Playlist mood analysis
  - [ ] Playlist diversity score
  - [ ] Most common additions
  - [ ] Playlist length distribution

## Performance Improvements
- [ ] API Optimization:
  - [ ] Implement request batching for multiple API calls
  - [ ] Add request caching with appropriate TTL
  - [ ] Optimize token refresh mechanism
- [ ] Frontend Performance:
  - [ ] Implement virtual scrolling for long lists
  - [ ] Add image lazy loading
  - [ ] Optimize component re-renders
  - [ ] Implement proper loading states
- [ ] Data Management:
  - [ ] Add local storage caching for frequently accessed data
  - [ ] Implement data prefetching for common user flows
  - [ ] Add data compression for large datasets
- [ ] Error Handling:
  - [ ] Implement retry mechanisms for failed API calls
  - [ ] Add fallback data for offline mode
  - [ ] Improve error recovery strategies

## Nice to Have (Post-MVP)
- [ ] Audio features analysis
- [ ] Playlist data
- [ ] Data export
- [ ] Share functionality

## Project Setup
- [x] Initialize Next.js project with TypeScript
- [x] Set up Shadcn UI components
- [x] Configure project structure:
  ```
  src/
    ├── app/
    │   ├── page.tsx (home/landing)
    │   ├── stats/
    │   │   └── page.tsx (main stats dashboard)
    │   └── api/
    │       └── auth/
    │           └── callback/
    │               └── spotify/
    │                   └── route.ts
    ├── components/
    │   ├── ui/ (shadcn components)
    │   ├── stats/
    │   │   ├── TopTracks.tsx
    │   │   ├── TopArtists.tsx
    │   │   ├── RecentlyPlayed.tsx
    │   │   └── AudioFeatures.tsx
    │   └── layout/
    │       ├── Header.tsx
    │       └── Sidebar.tsx
    ├── lib/
    │   ├── spotify.ts (Spotify API client setup)
    │   └── utils.ts
    └── types/
        └── spotify.ts
  ```
- [x] Set up environment variables:
  ```
  NEXT_PUBLIC_SPOTIFY_CLIENT_ID=
  NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=
  SPOTIFY_CLIENT_SECRET=
  ```

## Authentication
- [x] Implement Spotify OAuth2 using @spotify/web-api-ts-sdk
- [x] Create Spotify API client wrapper
- [x] Handle token refresh and session persistence
- [ ] Fix redirect URI configuration
- [ ] Implement proper error handling for auth failures
- [ ] Add loading states during authentication
- [ ] Implement proper session management

## Spotify API Integration
- [x] Set up Spotify Web API client using @spotify/web-api-ts-sdk
- [x] Implement API endpoints for:
  - [x] User profile data
  - [x] Top tracks (short, medium, long term)
  - [x] Top artists (short, medium, long term)
  - [x] Recently played tracks
  - [x] Audio features for tracks

## UI Components
- [x] Design and implement responsive layout
- [x] Create reusable components:
  - [x] Track card
  - [x] Artist card
  - [x] Stats card
  - [x] Time range selector
  - [x] Loading states
  - [x] Error states

## Features
- [x] User profile overview
- [x] Top tracks visualization
- [x] Top artists visualization
- [x] Recently played tracks
- [x] Audio features analysis
- [x] Time range selection (short, medium, long term)

## Data Visualization
- [ ] Implement charts and graphs for:
  - [ ] Track popularity
  - [ ] Artist popularity
  - [ ] Audio features distribution
  - [ ] Listening patterns over time

## Performance & Optimization
- [ ] Implement data caching
- [ ] Optimize API calls
- [x] Add loading states
- [x] Implement error handling
- [ ] Add retry mechanisms for failed API calls

## Testing
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Test authentication flow
- [ ] Test API integrations
- [ ] Test UI components

## Documentation
- [ ] Create README.md
- [ ] Document API endpoints
- [ ] Document component usage
- [ ] Add setup instructions
- [ ] Add deployment instructions
- [ ] Document authentication flow
- [ ] Add troubleshooting guide for common issues

## Deployment
- [ ] Set up CI/CD pipeline
- [ ] Configure production environment
- [ ] Set up monitoring and logging
- [ ] Configure domain and SSL
- [ ] Verify environment variables in production

## Future Enhancements
- [ ] Add playlist creation based on stats
- [ ] Implement recommendations based on listening history
- [ ] Add social sharing features
- [ ] Create user profiles with public stats
- [ ] Add comparison features between different time periods

# Spotify Stats - Future Features

## Listening Analysis
- [ ] Time of day listening patterns with heatmap visualization
- [ ] Day of week analysis showing peak listening times
- [ ] Seasonal trends analysis
- [ ] Work hours vs leisure hours listening comparison
- [ ] Listening streak tracking (consecutive days)
- [ ] Total listening time milestones and achievements

## Genre Analysis
- [ ] Genre mood analysis using Spotify's audio features
- [ ] Genre popularity trends over time
- [ ] Genre diversity score
- [ ] Genre-based recommendations
- [ ] Genre geography map (showing where your music comes from)
- [ ] Sub-genre breakdown and discovery
- [ ] Genre correlation analysis (which genres you often listen to together)

## Track Analysis
- [ ] Tempo distribution with interactive histogram
- [ ] Key signature distribution and music theory insights
- [ ] Popularity vs. Obscurity ratio
- [ ] Language distribution of tracks
- [ ] Lyrics analysis and word clouds
- [ ] Song length preferences analysis
- [ ] Explicit vs clean content ratio
- [ ] Release date distribution of favorite tracks

## Artist Deep Dive
- [ ] Artist location map
- [ ] New vs. established artists ratio
- [ ] Artist collaboration network visualization
- [ ] Artist gender distribution
- [ ] Record label distribution
- [ ] Artist popularity trends
- [ ] Concert/Tour tracking for favorite artists
- [ ] Similar artist recommendations

## Playlist Analysis
- [ ] Playlist mood analysis
- [ ] Playlist diversity score
- [ ] Most common playlist additions
- [ ] Playlist length distribution
- [ ] Collaborative vs. personal playlist stats
- [ ] Playlist sharing and compatibility
- [ ] Smart playlist suggestions
- [ ] Playlist health check (dead links, duplicates)

## Social Features
- [ ] Music taste compatibility with friends
- [ ] Shared artist/track statistics
- [ ] Music taste uniqueness score
- [ ] Friend activity feed
- [ ] Collaborative listening sessions
- [ ] Music taste tribes/groups
- [ ] Social challenges and competitions
- [ ] Share cards for social media

## Historical Data
- [x] Year-over-year comparisons
- [x] Monthly listening reports
- [ ] "Discovered On" dates for artists/tracks
- [ ] First listen timestamps
- [ ] Listening history timeline
- [ ] Music taste evolution analysis
- [ ] Nostalgia playlists generator
- [ ] Historical trends visualization

## Technical Improvements
- [ ] Offline mode support
- [ ] Data export functionality
- [ ] Custom date range selection
- [ ] Better error handling
- [ ] Loading state improvements
- [ ] Mobile responsive optimizations
- [ ] PWA support
- [ ] Dark/Light theme toggle
- [ ] Accessibility improvements
- [ ] Performance optimizations

## Integration Features
- [ ] Last.fm integration for historical data
- [ ] Apple Music data import
- [ ] YouTube Music data import
- [ ] Concert ticket integration (Songkick/Bandsintown)
- [ ] Lyrics integration (Genius/Musixmatch)
- [ ] Music news integration
- [ ] Local music library analysis
- [ ] Discord rich presence integration

## Premium Features
- [ ] Advanced analytics
- [ ] Extended historical data
- [ ] Custom reports
- [ ] API access
- [ ] Data backup
- [ ] Priority feature requests
- [ ] Ad-free experience
- [ ] Enhanced social features 