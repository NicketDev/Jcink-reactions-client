# JCink Reactions Client - Modular Architecture

This project has been refactored into a clean, modular architecture for better maintainability and testability.

## 📁 File Structure

```
src/
├── index.ts              # Main entry point - orchestrates all modules
├── types.ts              # TypeScript interfaces and type definitions
├── api.ts                # HTTP utilities and API communication
├── auth.ts               # User authentication and identification
├── state.ts              # State management for user choices and loading states
├── ui.ts                 # Common UI utilities and DOM helpers
├── components/
│   ├── votes.ts          # Vote functionality (upvote/downvote)
│   └── reactions.ts      # Reaction functionality (emoji reactions)
└── style.css             # CSS styles
```

## 🏗️ Architecture Overview

### **Main Entry Point (`index.ts`)**

- Orchestrates all modules
- Handles initialization and setup
- Manages the overall application flow
- ~150 lines (down from 680+ lines!)

### **Type System (`types.ts`)**

- Centralized TypeScript interfaces
- Provides type safety across all modules
- Documents the data structures used

### **API Layer (`api.ts`)**

- `ReactionsAPI` class for all HTTP communications
- Handles GET and PUT requests
- Manages JWT authentication for protected endpoints
- Centralizes server communication logic

### **Authentication (`auth.ts`)**

- `getCurrentUser()` function extracts user info from DOM
- Clean separation of auth concerns
- Easy to modify for different auth systems

### **State Management (`state.ts`)**

- `StateManager` class tracks user choices and loading states
- Prevents race conditions and duplicate requests
- Centralizes state logic for votes and reactions

### **UI Utilities (`ui.ts`)**

- Common DOM manipulation functions
- Reusable UI helpers (count updates, class toggles)
- Reduces code duplication

### **Component Modules**

#### **Votes (`components/votes.ts`)**

- `createVoteElements()` - DOM creation for vote UI
- `addVoteEventHandlers()` - Event handling for vote interactions
- `processVoteData()` - Server data processing and UI updates

#### **Reactions (`components/reactions.ts`)**

- `createReactionElements()` - DOM creation for reaction UI
- `addReactionEventHandlers()` - Event handling for reaction interactions
- `processReactionData()` - Server data processing and UI updates

## ✨ Benefits of This Architecture

1. **Maintainability**: Each module has a single responsibility
2. **Testability**: Individual modules can be unit tested
3. **Reusability**: Components can be reused or swapped out
4. **Readability**: Much smaller, focused files
5. **Type Safety**: Full TypeScript coverage with proper interfaces
6. **Separation of Concerns**: Clear boundaries between different functionality

## 🔧 How It Works

1. `index.ts` imports all necessary modules
2. Creates instances of `ReactionsAPI` and `StateManager`
3. Processes each post on the page:
   - Creates vote/reaction UI elements
   - Attaches event handlers
   - Stores elements in a map
4. Loads existing data from server
5. Updates UI with current state

The modular design makes it easy to:

- Add new reaction types
- Modify authentication logic
- Change API endpoints
- Add new features
- Debug issues
- Write tests

Each module is self-contained and communicates through well-defined interfaces, making the codebase much more maintainable and extensible.
