# FeySpace Campaign Tracker

A comprehensive D&D 5e campaign management tool combining D&D Beyond-style character sheets with Obsidian-style wiki features, designed specifically for Spelljammer campaigns.

## Features

### 📊 Interactive Dashboard
- Campaign overview with key statistics
- Active quests tracking
- Recent notes display
- Quick action buttons for common tasks

### 👥 Character Management
- **Interactive Character Sheets**: Full D&D 5e character sheets with real-time updates
- **HP Tracking**: Visual HP bars with damage/healing controls and temporary HP
- **Spell Slot Management**: Track all spell slot levels with checkbox interface
- **Hit Dice**: Spend hit dice during short rests with automatic healing calculation
- **Death Saves**: Automatic death save UI when HP reaches 0
- **Conditions**: Add and track status conditions with visual badges
- **Ability Checks**: Click stats to roll ability checks with modifiers
- **Rest Management**: Short and long rest buttons with automatic resource restoration

### 📚 Campaign Wiki
- **Markdown Support**: Full markdown formatting for rich text notes
- **Wiki Links**: Use `[[Page Name]]` to create interconnected notes
- **Tags**: Organize pages with `#tag` syntax
- **Backlinks**: See which pages link to the current page
- **Graph View**: Visualize connections between wiki pages
- **Search**: Full-text search across all wiki pages

### ⚔️ Combat Tracker
- Initiative tracking with turn management
- Add/remove combatants dynamically
- HP tracking for all combatants
- Round counter and current turn indicator
- Visual highlighting of active combatant

### 📝 Session Notes
- Chronicle your adventures session by session
- Edit and delete session notes
- Export all notes to markdown format
- Automatic session numbering

### 🎲 Dice Roller
- Quick roll buttons for common dice (d4, d6, d8, d10, d12, d20, d100)
- Custom dice roller with multiple dice and modifiers
- Advantage/Disadvantage support
- Roll history with timestamps
- Save preset rolls for frequently used combinations
- Re-roll from history

### 🎒 Party Inventory
- Shared party inventory management
- Track item quantities and weights
- Total weight calculation
- Add/remove items with quantity controls

### ⭐ Level Progression
- Milestone-based advancement system
- Visual progress bar
- Track completed milestones
- Automatic level-up notifications

### 👹 Encounter Builder
- Generate encounter budgets based on party level and size
- Difficulty settings (Easy, Medium, Hard, Deadly)
- XP threshold calculations

### 📖 Compendium
- **Spells**: Browse Feywild, Feyspace, and standard D&D spells
- **Items**: Magic items, equipment, and Spelljammer-specific gear
- **Monsters**: Creature stat blocks including Spelljammer creatures
- **Rules**: Quick reference for D&D 5e and Spelljammer rules
- Search and sort functionality
- Detailed stat blocks and descriptions

## How to Use

1. **Open the Application**: Open `index.html` in a modern web browser (Chrome, Firefox, Edge, or Safari)
2. **Automatic Saving**: All data is automatically saved to browser localStorage
3. **Export Regularly**: Use the "Export Campaign" button on the dashboard to create backup files
4. **Import Data**: Use the "Import Campaign" button to restore from a backup file

## Data Management

### Export Campaign
- Click "💾 Export Campaign" on the dashboard
- Downloads a JSON file with all campaign data
- Filename includes the current date for easy organization
- Recommended: Export regularly to prevent data loss

### Import Campaign
- Click "📥 Import Campaign" on the dashboard
- Select a previously exported JSON file
- Confirms before overwriting current data
- Automatically reloads the page after import

## Character Features

### HP Management
- Click +/- buttons to modify HP
- Damage automatically applies to temporary HP first
- Visual HP bar changes color based on health percentage
- Death saves appear automatically at 0 HP

### Spell Slots
- All spell slot levels displayed (not just level 1)
- Click checkboxes to mark slots as used/available
- Short rest and long rest buttons restore appropriate resources

### Hit Dice
- Displays available hit dice (e.g., "2 / 2 d8")
- Click "Spend Hit Die" to roll and heal
- Automatically adds Constitution modifier to healing
- Restored on long rest (half maximum)

### Conditions
- Select from standard D&D 5e conditions
- Visual badges show active conditions
- Click X to remove conditions

## Wiki Features

### Creating Pages
1. Click "+ New Page" or use the quick action button
2. Enter a page title
3. Write content using markdown
4. Use `[[Page Name]]` to link to other pages
5. Use `#tag` to categorize pages
6. Click "💾 Save"

### Linking Pages
- Type `[[Page Name]]` to create a link
- Links to existing pages appear in blue
- Links to non-existent pages appear in red (click to create)
- Backlinks automatically track which pages link to the current page

### Graph View
- Click "🕸️ Graph View" to visualize page connections
- Nodes represent pages
- Arrows show links between pages
- Click nodes to navigate to pages

## Combat Tracker

### Starting Combat
1. Click "➕ Add Combatant" for each participant
2. Enter name, initiative roll, and max HP
3. Click "▶️ Start Combat" to begin
4. Use "⏭️ Next Turn" to advance through initiative order
5. Click "⏹️ End Combat" when finished

### Managing Combatants
- Use +/- buttons to adjust HP
- Visual HP bars show health status
- Active combatant is highlighted
- Remove combatants with the ✕ button

## Tech Stack

- **Frontend**: Vanilla JavaScript (no frameworks required)
- **Markdown**: Marked.js for markdown parsing
- **Visualization**: Vis.js for graph view
- **Storage**: Browser localStorage for data persistence
- **Styling**: Custom CSS with responsive design

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Responsive design works on tablets and phones

## Data Storage

All campaign data is stored in your browser's localStorage:
- Character stats and resources
- Wiki pages and links
- Session notes
- Combat encounters
- Inventory items
- Level progression
- Dice presets

**Important**: localStorage is browser-specific. Export your campaign regularly to avoid data loss if you:
- Clear browser data
- Switch browsers
- Use a different device

## Tips & Best Practices

1. **Regular Backups**: Export your campaign after each session
2. **Wiki Organization**: Use tags consistently to organize pages
3. **Preset Rolls**: Save frequently used rolls (attack rolls, spell DCs, etc.)
4. **Session Notes**: Document key events, NPCs met, and loot acquired
5. **Conditions**: Keep character conditions updated for accurate gameplay
6. **Hit Dice**: Remember to spend hit dice during short rests
7. **Spell Slots**: Mark slots as used immediately to avoid confusion

## Troubleshooting

### Data Not Saving
- Ensure you're not in private/incognito mode
- Check browser localStorage is enabled
- Try exporting and importing to refresh data

### Graph View Not Loading
- Ensure you have an internet connection (loads vis.js from CDN)
- Check browser console for errors
- Try refreshing the page

### Character Sheet Not Updating
- Refresh the character sheet by clicking the character button again
- Check browser console for JavaScript errors
- Try clearing localStorage and importing a backup

## Future Enhancements

Potential features for future development:
- Ship combat mechanics
- Wildspace navigation tools
- Faction reputation tracking
- Treasure hoard calculator
- Random encounter generator
- NPC generator
- Spell preparation tracker
- Custom character stats

## Credits

Created for the FeySpace campaign featuring:
- 💀 Ben "Tony" Bingletonarius (Bard)
- 🫧 Flow Jello (Paladin)
- 🦗 Bazil "Baz" (Artificer)
- 🔮 Wisperincheeks "Wisp" (Warlock)

Serving the N.I.P.P.L.E. Corporation aboard the Kestrel-11.

## License

This is a personal campaign management tool. Feel free to adapt it for your own campaigns!
