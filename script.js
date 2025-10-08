// FeySpace Campaign - Enhanced JavaScript
// Combines D&D Beyond character management with Obsidian-style wiki features

// ===== DATA STORAGE =====
let campaignData = {
    level: 2,
    location: 'FeySpace',
    sessions: [],
    wikiPages: [],
    inventory: [],
    levelProgress: {
        currentLevel: 2,
        milestonesCompleted: 0,
        milestonesNeeded: 3,
        milestones: []
    },
    combat: {
        active: false,
        round: 1,
        currentTurn: 0,
        combatants: []
    },
    characters: {
        tony: {
            name: 'Tony',
            maxHp: 16,
            currentHp: 16,
            tempHp: 0,
            hitDice: 2,
            maxHitDice: 2,
            hitDie: 8,
            conModifier: 1,
            spellSlots: {
                1: { max: 3, current: 3 },
                2: { max: 0, current: 0 },
                3: { max: 0, current: 0 },
                4: { max: 0, current: 0 },
                5: { max: 0, current: 0 }
            },
            conditions: []
        },
        flow: {
            name: 'Flow',
            maxHp: 20,
            currentHp: 20,
            tempHp: 0,
            hitDice: 2,
            maxHitDice: 2,
            hitDie: 10,
            conModifier: 2,
            spellSlots: {
                1: { max: 3, current: 3 },
                2: { max: 0, current: 0 },
                3: { max: 0, current: 0 },
                4: { max: 0, current: 0 },
                5: { max: 0, current: 0 }
            },
            conditions: []
        },
        baz: {
            name: 'Baz',
            maxHp: 18,
            currentHp: 18,
            tempHp: 0,
            hitDice: 2,
            maxHitDice: 2,
            hitDie: 8,
            conModifier: 1,
            spellSlots: {
                1: { max: 2, current: 2 },
                2: { max: 0, current: 0 },
                3: { max: 0, current: 0 },
                4: { max: 0, current: 0 },
                5: { max: 0, current: 0 }
            },
            conditions: []
        },
        wisp: {
            name: 'Wisp',
            maxHp: 19,
            currentHp: 19,
            tempHp: 0,
            hitDice: 2,
            maxHitDice: 2,
            hitDie: 8,
            conModifier: 2,
            spellSlots: {
                1: { max: 2, current: 2 },
                2: { max: 0, current: 0 },
                3: { max: 0, current: 0 },
                4: { max: 0, current: 0 },
                5: { max: 0, current: 0 }
            },
            conditions: []
        }
    }
};

let diceHistory = [];
let dicePresets = [];
let currentWikiPage = null;
let previewMode = false;
let graphNetwork = null;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    loadCampaignData();
    updateDashboard();
    updateWikiSidebar();
    updateInventoryDisplay();
    updateLevelProgressDisplay();
    updateSessionsDisplay();
    updateDiceHistory();
    updatePresetsList();
    
    // Make advantage/disadvantage mutually exclusive
    const advantageCheckbox = document.getElementById('advantage');
    const disadvantageCheckbox = document.getElementById('disadvantage');
    
    if (advantageCheckbox && disadvantageCheckbox) {
        advantageCheckbox.addEventListener('change', function() {
            if (this.checked) {
                disadvantageCheckbox.checked = false;
            }
        });
        
        disadvantageCheckbox.addEventListener('change', function() {
            if (this.checked) {
                advantageCheckbox.checked = false;
            }
        });
    }
    
    // Load dice history from localStorage
    const savedHistory = localStorage.getItem('feyspace-dice-history');
    if (savedHistory) {
        diceHistory = JSON.parse(savedHistory);
        updateDiceHistory();
    }
    
    // Load dice presets from localStorage
    const savedPresets = localStorage.getItem('feyspace-dice-presets');
    if (savedPresets) {
        dicePresets = JSON.parse(savedPresets);
        updatePresetsList();
    }
});

function loadCampaignData() {
    const saved = localStorage.getItem('feyspace-campaign-data');
    if (saved) {
        const loaded = JSON.parse(saved);
        campaignData = { ...campaignData, ...loaded };
    }
}

function saveCampaignData() {
    localStorage.setItem('feyspace-campaign-data', JSON.stringify(campaignData));
}

// ===== NAVIGATION =====
function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.querySelector(`[onclick*="'${sectionId}'"]`);
    if (activeBtn) activeBtn.classList.add('active');
    
    if (sectionId === 'dashboard') {
        updateDashboard();
    }
}

// ===== DASHBOARD =====
function updateDashboard() {
    document.getElementById('dash-party-level').textContent = campaignData.level;
    document.getElementById('dash-sessions').textContent = campaignData.sessions.length;
    document.getElementById('dash-wiki-pages').textContent = campaignData.wikiPages.length;
    document.getElementById('dash-location').textContent = campaignData.location;
    
    const npcCount = campaignData.wikiPages.filter(page => 
        page.content.includes('#npc')
    ).length;
    document.getElementById('dash-npcs').textContent = npcCount;
    
    updateActiveQuests();
    updateRecentNotes();
}

function updateActiveQuests() {
    const questPages = campaignData.wikiPages.filter(page => 
        page.content.includes('#quest') && !page.content.includes('#completed')
    );
    
    const listDiv = document.getElementById('active-quests-list');
    
    if (questPages.length === 0) {
        listDiv.innerHTML = '<p class="empty-state">No active quests. Add quests in the Campaign Wiki.</p>';
        return;
    }
    
    let html = '<ul class="quest-list">';
    questPages.slice(0, 5).forEach(page => {
        html += `<li onclick="openWikiPage('${page.id}')">${page.title}</li>`;
    });
    html += '</ul>';
    listDiv.innerHTML = html;
}

function updateRecentNotes() {
    const recentPages = [...campaignData.wikiPages]
        .sort((a, b) => b.modified - a.modified)
        .slice(0, 5);
    
    const listDiv = document.getElementById('recent-notes-list');
    
    if (recentPages.length === 0) {
        listDiv.innerHTML = '<p class="empty-state">No recent notes. Start writing in the Campaign Wiki.</p>';
        return;
    }
    
    let html = '<ul class="recent-list">';
    recentPages.forEach(page => {
        const date = new Date(page.modified).toLocaleDateString();
        html += `<li onclick="openWikiPage('${page.id}')">
            <strong>${page.title}</strong>
            <span class="note-date">${date}</span>
        </li>`;
    });
    html += '</ul>';
    listDiv.innerHTML = html;
}

// ===== CHARACTER SHEETS =====
function showCharacter(charName) {
    const characters = {
        tony: getTonySheet(),
        flow: getFlowSheet(),
        baz: getBazSheet(),
        wisp: getWispSheet()
    };
    
    document.getElementById('character-content').innerHTML = characters[charName];
    
    // Initialize displays after HTML is rendered
    setTimeout(() => {
        updateHPDisplay(charName);
        updateConditionsDisplay(charName);
    }, 0);
}

function getTonySheet() {
    const char = campaignData.characters.tony;
    return `
        <div class="character-sheet interactive">
            <div class="character-header">
                <h2>💀 Ben "Tony" Bingletonarius</h2>
                <p class="job-title">PEEN - Protective Engagement & Emergency Negotiator</p>
                <p class="species">Human Skeleton • Bard • Level ${campaignData.level}</p>
            </div>
            
            <div class="char-stats-grid">
                <div class="stat-block clickable" onclick="rollAbilityCheck(0, 'STR', 'Tony')">
                    <div class="stat-name">STR</div>
                    <div class="stat-value">10</div>
                    <div class="stat-mod">+0</div>
                </div>
                <div class="stat-block clickable" onclick="rollAbilityCheck(2, 'DEX', 'Tony')">
                    <div class="stat-name">DEX</div>
                    <div class="stat-value">14</div>
                    <div class="stat-mod">+2</div>
                </div>
                <div class="stat-block clickable" onclick="rollAbilityCheck(1, 'CON', 'Tony')">
                    <div class="stat-name">CON</div>
                    <div class="stat-value">12</div>
                    <div class="stat-mod">+1</div>
                </div>
                <div class="stat-block clickable" onclick="rollAbilityCheck(0, 'INT', 'Tony')">
                    <div class="stat-name">INT</div>
                    <div class="stat-value">10</div>
                    <div class="stat-mod">+0</div>
                </div>
                <div class="stat-block clickable" onclick="rollAbilityCheck(1, 'WIS', 'Tony')">
                    <div class="stat-name">WIS</div>
                    <div class="stat-value">12</div>
                    <div class="stat-mod">+1</div>
                </div>
                <div class="stat-block clickable" onclick="rollAbilityCheck(3, 'CHA', 'Tony')">
                    <div class="stat-name">CHA</div>
                    <div class="stat-value">16</div>
                    <div class="stat-mod">+3</div>
                </div>
            </div>

            <div class="char-section">
                <h3>Hit Points</h3>
                <div class="hp-tracker">
                    <div class="hp-display">
                        <span class="hp-current" id="tony-hp-current">${char.currentHp}</span> / 
                        <span class="hp-max">${char.maxHp}</span>
                    </div>
                    <div class="hp-bar-container">
                        <div class="hp-bar" id="tony-hp-bar" style="width: ${(char.currentHp / char.maxHp) * 100}%"></div>
                    </div>
                    <div class="hp-controls">
                        <button onclick="modifyHP('tony', -5)">-5</button>
                        <button onclick="modifyHP('tony', -1)">-1</button>
                        <button onclick="modifyHP('tony', 1)">+1</button>
                        <button onclick="modifyHP('tony', 5)">+5</button>
                    </div>
                    <div class="temp-hp">
                        <label>Temp HP:</label>
                        <input type="number" id="tony-temp-hp" value="${char.tempHp}" min="0">
                        <button onclick="applyTempHP('tony')">Set</button>
                    </div>
                </div>
            </div>

            <div id="tony-death-saves" class="death-saves" style="display: none;">
                <h4>Death Saves</h4>
                <div class="death-save-boxes">
                    <div>
                        <strong>Successes:</strong>
                        ${[1,2,3].map(i => `<input type="checkbox" id="tony-success-${i}">`).join('')}
                    </div>
                    <div>
                        <strong>Failures:</strong>
                        ${[1,2,3].map(i => `<input type="checkbox" id="tony-fail-${i}">`).join('')}
                    </div>
                </div>
                <button onclick="stabilize('tony')">Stabilize</button>
            </div>

            <div class="char-section">
                <h3>Combat Stats</h3>
                <div class="combat-stats">
                    <div class="combat-stat">
                        <strong>AC</strong>
                        <span>14</span>
                    </div>
                    <div class="combat-stat">
                        <strong>Speed</strong>
                        <span>30 ft</span>
                    </div>
                    <div class="combat-stat clickable" onclick="rollInitiative(2, 'Tony')">
                        <strong>Initiative</strong>
                        <span>+2</span>
                    </div>
                </div>
            </div>

            <div id="roll-results-tony" class="roll-results"></div>

            <div class="char-section">
                <h3>Hit Dice</h3>
                <div class="hit-dice-tracker">
                    <p><strong>Available:</strong> ${char.hitDice} / ${char.maxHitDice} d${char.hitDie}</p>
                    <button onclick="spendHitDice('tony')" ${char.hitDice === 0 ? 'disabled' : ''}>
                        Spend Hit Die
                    </button>
                </div>
            </div>

            <div class="char-section">
                <h3>Spell Slots</h3>
                <div class="spell-slots-section">
                    ${Object.entries(char.spellSlots).filter(([level, slots]) => slots.max > 0).map(([level, slots]) => `
                        <div class="spell-level">
                            <strong>Level ${level}</strong>
                            <div class="slot-checkboxes">
                                ${Array.from({length: slots.max}, (_, i) => `
                                    <input type="checkbox" id="tony-slot-${level}-${i+1}" 
                                        ${i < slots.current ? 'checked' : ''} 
                                        onchange="toggleSpellSlot('tony', ${level}, ${i+1})">
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="rest-buttons">
                    <button onclick="shortRest('tony')">Short Rest</button>
                    <button onclick="longRest('tony')">Long Rest</button>
                </div>
            </div>

            <div class="char-section">
                <h3>Conditions</h3>
                <div class="conditions-tracker">
                    <div class="condition-select">
                        <select id="tony-condition-select">
                            <option value="">-- Add Condition --</option>
                            <option value="blinded">Blinded</option>
                            <option value="charmed">Charmed</option>
                            <option value="deafened">Deafened</option>
                            <option value="frightened">Frightened</option>
                            <option value="grappled">Grappled</option>
                            <option value="incapacitated">Incapacitated</option>
                            <option value="invisible">Invisible</option>
                            <option value="paralyzed">Paralyzed</option>
                            <option value="petrified">Petrified</option>
                            <option value="poisoned">Poisoned</option>
                            <option value="prone">Prone</option>
                            <option value="restrained">Restrained</option>
                            <option value="stunned">Stunned</option>
                            <option value="unconscious">Unconscious</option>
                        </select>
                        <button onclick="addCondition('tony')">Add</button>
                    </div>
                    <div id="tony-active-conditions" class="active-conditions"></div>
                </div>
            </div>

            <div class="char-section">
                <h3>Personality</h3>
                <div class="catchphrase">"B-b-b-b-bad to the bone!"</div>
                <p>Short and blunt. Sarcastic humor. Forgets he's dead sometimes.</p>
            </div>
        </div>
    `;
}

function getFlowSheet() {
    const char = campaignData.characters.flow;
    return `
        <div class="character-sheet interactive">
            <div class="character-header">
                <h2>🫧 Flow Jello</h2>
                <p class="job-title">CLIT - Corporate Liaison & Interplanetary Talker</p>
                <p class="species">Plasmoid • Paladin • Level ${campaignData.level}</p>
            </div>
            
            <div class="char-stats-grid">
                <div class="stat-block clickable" onclick="rollAbilityCheck(3, 'STR', 'Flow')">
                    <div class="stat-name">STR</div>
                    <div class="stat-value">16</div>
                    <div class="stat-mod">+3</div>
                </div>
                <div class="stat-block clickable" onclick="rollAbilityCheck(0, 'DEX', 'Flow')">
                    <div class="stat-name">DEX</div>
                    <div class="stat-value">10</div>
                    <div class="stat-mod">+0</div>
                </div>
                <div class="stat-block clickable" onclick="rollAbilityCheck(2, 'CON', 'Flow')">
                    <div class="stat-name">CON</div>
                    <div class="stat-value">14</div>
                    <div class="stat-mod">+2</div>
                </div>
                <div class="stat-block clickable" onclick="rollAbilityCheck(1, 'INT', 'Flow')">
                    <div class="stat-name">INT</div>
                    <div class="stat-value">12</div>
                    <div class="stat-mod">+1</div>
                </div>
                <div class="stat-block clickable" onclick="rollAbilityCheck(0, 'WIS', 'Flow')">
                    <div class="stat-name">WIS</div>
                    <div class="stat-value">10</div>
                    <div class="stat-mod">+0</div>
                </div>
                <div class="stat-block clickable" onclick="rollAbilityCheck(3, 'CHA', 'Flow')">
                    <div class="stat-name">CHA</div>
                    <div class="stat-value">16</div>
                    <div class="stat-mod">+3</div>
                </div>
            </div>

            <div class="char-section">
                <h3>Hit Points</h3>
                <div class="hp-tracker">
                    <div class="hp-display">
                        <span class="hp-current" id="flow-hp-current">${char.currentHp}</span> / 
                        <span class="hp-max">${char.maxHp}</span>
                    </div>
                    <div class="hp-bar-container">
                        <div class="hp-bar" id="flow-hp-bar" style="width: ${(char.currentHp / char.maxHp) * 100}%"></div>
                    </div>
                    <div class="hp-controls">
                        <button onclick="modifyHP('flow', -5)">-5</button>
                        <button onclick="modifyHP('flow', -1)">-1</button>
                        <button onclick="modifyHP('flow', 1)">+1</button>
                        <button onclick="modifyHP('flow', 5)">+5</button>
                    </div>
                    <div class="temp-hp">
                        <label>Temp HP:</label>
                        <input type="number" id="flow-temp-hp" value="${char.tempHp}" min="0">
                        <button onclick="applyTempHP('flow')">Set</button>
                    </div>
                </div>
            </div>

            <div id="flow-death-saves" class="death-saves" style="display: none;">
                <h4>Death Saves</h4>
                <div class="death-save-boxes">
                    <div>
                        <strong>Successes:</strong>
                        ${[1,2,3].map(i => `<input type="checkbox" id="flow-success-${i}">`).join('')}
                    </div>
                    <div>
                        <strong>Failures:</strong>
                        ${[1,2,3].map(i => `<input type="checkbox" id="flow-fail-${i}">`).join('')}
                    </div>
                </div>
                <button onclick="stabilize('flow')">Stabilize</button>
            </div>

            <div class="char-section">
                <h3>Combat Stats</h3>
                <div class="combat-stats">
                    <div class="combat-stat">
                        <strong>AC</strong>
                        <span>16</span>
                    </div>
                    <div class="combat-stat">
                        <strong>Speed</strong>
                        <span>30 ft</span>
                    </div>
                    <div class="combat-stat clickable" onclick="rollInitiative(0, 'Flow')">
                        <strong>Initiative</strong>
                        <span>+0</span>
                    </div>
                </div>
            </div>

            <div id="roll-results-flow" class="roll-results"></div>

            <div class="char-section">
                <h3>Hit Dice</h3>
                <div class="hit-dice-tracker">
                    <p><strong>Available:</strong> ${char.hitDice} / ${char.maxHitDice} d${char.hitDie}</p>
                    <button onclick="spendHitDice('flow')" ${char.hitDice === 0 ? 'disabled' : ''}>
                        Spend Hit Die
                    </button>
                </div>
            </div>

            <div class="char-section">
                <h3>Spell Slots</h3>
                <div class="spell-slots-section">
                    ${Object.entries(char.spellSlots).filter(([level, slots]) => slots.max > 0).map(([level, slots]) => `
                        <div class="spell-level">
                            <strong>Level ${level}</strong>
                            <div class="slot-checkboxes">
                                ${Array.from({length: slots.max}, (_, i) => `
                                    <input type="checkbox" id="flow-slot-${level}-${i+1}" 
                                        ${i < slots.current ? 'checked' : ''} 
                                        onchange="toggleSpellSlot('flow', ${level}, ${i+1})">
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="rest-buttons">
                    <button onclick="shortRest('flow')">Short Rest</button>
                    <button onclick="longRest('flow')">Long Rest</button>
                </div>
            </div>

            <div class="char-section">
                <h3>Conditions</h3>
                <div class="conditions-tracker">
                    <div class="condition-select">
                        <select id="flow-condition-select">
                            <option value="">-- Add Condition --</option>
                            <option value="blinded">Blinded</option>
                            <option value="charmed">Charmed</option>
                            <option value="deafened">Deafened</option>
                            <option value="frightened">Frightened</option>
                            <option value="grappled">Grappled</option>
                            <option value="incapacitated">Incapacitated</option>
                            <option value="invisible">Invisible</option>
                            <option value="paralyzed">Paralyzed</option>
                            <option value="petrified">Petrified</option>
                            <option value="poisoned">Poisoned</option>
                            <option value="prone">Prone</option>
                            <option value="restrained">Restrained</option>
                            <option value="stunned">Stunned</option>
                            <option value="unconscious">Unconscious</option>
                        </select>
                        <button onclick="addCondition('flow')">Add</button>
                    </div>
                    <div id="flow-active-conditions" class="active-conditions"></div>
                </div>
            </div>

            <div class="char-section">
                <h3>Personality</h3>
                <div class="catchphrase">"It's me. I'm the CLIT."</div>
                <p>Earnest professional. Internalized N.I.P.P.L.E.'s customer service training completely.</p>
            </div>
        </div>
    `;
}

function getBazSheet() {
    const char = campaignData.characters.baz;
    return `
        <div class="character-sheet interactive">
            <div class="character-header">
                <h2>🦗 Bazil "Baz"</h2>
                <p class="job-title">ASS - Applied Systems Specialist</p>
                <p class="species">Thri-Kreen (Cyborg) • Artificer • Level ${campaignData.level}</p>
            </div>
            
            <div class="char-stats-grid">
                <div class="stat-block clickable" onclick="rollAbilityCheck(2, 'STR', 'Baz')">
                    <div class="stat-name">STR</div>
                    <div class="stat-value">14</div>
                    <div class="stat-mod">+2</div>
                </div>
                <div class="stat-block clickable" onclick="rollAbilityCheck(2, 'DEX', 'Baz')">
                    <div class="stat-name">DEX</div>
                    <div class="stat-value">14</div>
                    <div class="stat-mod">+2</div>
                </div>
                <div class="stat-block clickable" onclick="rollAbilityCheck(1, 'CON', 'Baz')">
                    <div class="stat-name">CON</div>
                    <div class="stat-value">12</div>
                    <div class="stat-mod">+1</div>
                </div>
                <div class="stat-block clickable" onclick="rollAbilityCheck(3, 'INT', 'Baz')">
                    <div class="stat-name">INT</div>
                    <div class="stat-value">16</div>
                    <div class="stat-mod">+3</div>
                </div>
                <div class="stat-block clickable" onclick="rollAbilityCheck(1, 'WIS', 'Baz')">
                    <div class="stat-name">WIS</div>
                    <div class="stat-value">12</div>
                    <div class="stat-mod">+1</div>
                </div>
                <div class="stat-block clickable" onclick="rollAbilityCheck(-1, 'CHA', 'Baz')">
                    <div class="stat-name">CHA</div>
                    <div class="stat-value">8</div>
                    <div class="stat-mod">-1</div>
                </div>
            </div>

            <div class="char-section">
                <h3>Hit Points</h3>
                <div class="hp-tracker">
                    <div class="hp-display">
                        <span class="hp-current" id="baz-hp-current">${char.currentHp}</span> / 
                        <span class="hp-max">${char.maxHp}</span>
                    </div>
                    <div class="hp-bar-container">
                        <div class="hp-bar" id="baz-hp-bar" style="width: ${(char.currentHp / char.maxHp) * 100}%"></div>
                    </div>
                    <div class="hp-controls">
                        <button onclick="modifyHP('baz', -5)">-5</button>
                        <button onclick="modifyHP('baz', -1)">-1</button>
                        <button onclick="modifyHP('baz', 1)">+1</button>
                        <button onclick="modifyHP('baz', 5)">+5</button>
                    </div>
                    <div class="temp-hp">
                        <label>Temp HP:</label>
                        <input type="number" id="baz-temp-hp" value="${char.tempHp}" min="0">
                        <button onclick="applyTempHP('baz')">Set</button>
                    </div>
                </div>
            </div>

            <div id="baz-death-saves" class="death-saves" style="display: none;">
                <h4>Death Saves</h4>
                <div class="death-save-boxes">
                    <div>
                        <strong>Successes:</strong>
                        ${[1,2,3].map(i => `<input type="checkbox" id="baz-success-${i}">`).join('')}
                    </div>
                    <div>
                        <strong>Failures:</strong>
                        ${[1,2,3].map(i => `<input type="checkbox" id="baz-fail-${i}">`).join('')}
                    </div>
                </div>
                <button onclick="stabilize('baz')">Stabilize</button>
            </div>

            <div class="char-section">
                <h3>Combat Stats</h3>
                <div class="combat-stats">
                    <div class="combat-stat">
                        <strong>AC</strong>
                        <span>15</span>
                    </div>
                    <div class="combat-stat">
                        <strong>Speed</strong>
                        <span>30 ft</span>
                    </div>
                    <div class="combat-stat clickable" onclick="rollInitiative(2, 'Baz')">
                        <strong>Initiative</strong>
                        <span>+2</span>
                    </div>
                </div>
            </div>

            <div id="roll-results-baz" class="roll-results"></div>

            <div class="char-section">
                <h3>Hit Dice</h3>
                <div class="hit-dice-tracker">
                    <p><strong>Available:</strong> ${char.hitDice} / ${char.maxHitDice} d${char.hitDie}</p>
                    <button onclick="spendHitDice('baz')" ${char.hitDice === 0 ? 'disabled' : ''}>
                        Spend Hit Die
                    </button>
                </div>
            </div>

            <div class="char-section">
                <h3>Spell Slots</h3>
                <div class="spell-slots-section">
                    ${Object.entries(char.spellSlots).filter(([level, slots]) => slots.max > 0).map(([level, slots]) => `
                        <div class="spell-level">
                            <strong>Level ${level}</strong>
                            <div class="slot-checkboxes">
                                ${Array.from({length: slots.max}, (_, i) => `
                                    <input type="checkbox" id="baz-slot-${level}-${i+1}" 
                                        ${i < slots.current ? 'checked' : ''} 
                                        onchange="toggleSpellSlot('baz', ${level}, ${i+1})">
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="rest-buttons">
                    <button onclick="shortRest('baz')">Short Rest</button>
                    <button onclick="longRest('baz')">Long Rest</button>
                </div>
            </div>

            <div class="char-section">
                <h3>Conditions</h3>
                <div class="conditions-tracker">
                    <div class="condition-select">
                        <select id="baz-condition-select">
                            <option value="">-- Add Condition --</option>
                            <option value="blinded">Blinded</option>
                            <option value="charmed">Charmed</option>
                            <option value="deafened">Deafened</option>
                            <option value="frightened">Frightened</option>
                            <option value="grappled">Grappled</option>
                            <option value="incapacitated">Incapacitated</option>
                            <option value="invisible">Invisible</option>
                            <option value="paralyzed">Paralyzed</option>
                            <option value="petrified">Petrified</option>
                            <option value="poisoned">Poisoned</option>
                            <option value="prone">Prone</option>
                            <option value="restrained">Restrained</option>
                            <option value="stunned">Stunned</option>
                            <option value="unconscious">Unconscious</option>
                        </select>
                        <button onclick="addCondition('baz')">Add</button>
                    </div>
                    <div id="baz-active-conditions" class="active-conditions"></div>
                </div>
            </div>

            <div class="char-section">
                <h3>Personality</h3>
                <div class="catchphrase">"If it works, it works."</div>
                <p>152 years old. Blue-collar dad energy. Quiet competence. Coffee addict.</p>
            </div>
        </div>
    `;
}

function getWispSheet() {
    const char = campaignData.characters.wisp;
    return `
        <div class="character-sheet interactive">
            <div class="character-header">
                <h2>🔮 Wisperincheeks "Wisp"</h2>
                <p class="job-title">TOP - Trajectory Optimization Professional</p>
                <p class="species">Goliath • Warlock • Level ${campaignData.level}</p>
            </div>
            
            <div class="char-stats-grid">
                <div class="stat-block clickable" onclick="rollAbilityCheck(3, 'STR', 'Wisp')">
                    <div class="stat-name">STR</div>
                    <div class="stat-value">16</div>
                    <div class="stat-mod">+3</div>
                </div>
                <div class="stat-block clickable" onclick="rollAbilityCheck(0, 'DEX', 'Wisp')">
                    <div class="stat-name">DEX</div>
                    <div class="stat-value">10</div>
                    <div class="stat-mod">+0</div>
                </div>
                <div class="stat-block clickable" onclick="rollAbilityCheck(2, 'CON', 'Wisp')">
                    <div class="stat-name">CON</div>
                    <div class="stat-value">14</div>
                    <div class="stat-mod">+2</div>
                </div>
                <div class="stat-block clickable" onclick="rollAbilityCheck(0, 'INT', 'Wisp')">
                    <div class="stat-name">INT</div>
                    <div class="stat-value">10</div>
                    <div class="stat-mod">+0</div>
                </div>
                <div class="stat-block clickable" onclick="rollAbilityCheck(4, 'WIS', 'Wisp')">
                    <div class="stat-name">WIS</div>
                    <div class="stat-value">18</div>
                    <div class="stat-mod">+4</div>
                </div>
                <div class="stat-block clickable" onclick="rollAbilityCheck(2, 'CHA', 'Wisp')">
                    <div class="stat-name">CHA</div>
                    <div class="stat-value">14</div>
                    <div class="stat-mod">+2</div>
                </div>
            </div>

            <div class="char-section">
                <h3>Hit Points</h3>
                <div class="hp-tracker">
                    <div class="hp-display">
                        <span class="hp-current" id="wisp-hp-current">${char.currentHp}</span> / 
                        <span class="hp-max">${char.maxHp}</span>
                    </div>
                    <div class="hp-bar-container">
                        <div class="hp-bar" id="wisp-hp-bar" style="width: ${(char.currentHp / char.maxHp) * 100}%"></div>
                    </div>
                    <div class="hp-controls">
                        <button onclick="modifyHP('wisp', -5)">-5</button>
                        <button onclick="modifyHP('wisp', -1)">-1</button>
                        <button onclick="modifyHP('wisp', 1)">+1</button>
                        <button onclick="modifyHP('wisp', 5)">+5</button>
                    </div>
                    <div class="temp-hp">
                        <label>Temp HP:</label>
                        <input type="number" id="wisp-temp-hp" value="${char.tempHp}" min="0">
                        <button onclick="applyTempHP('wisp')">Set</button>
                    </div>
                </div>
            </div>

            <div id="wisp-death-saves" class="death-saves" style="display: none;">
                <h4>Death Saves</h4>
                <div class="death-save-boxes">
                    <div>
                        <strong>Successes:</strong>
                        ${[1,2,3].map(i => `<input type="checkbox" id="wisp-success-${i}">`).join('')}
                    </div>
                    <div>
                        <strong>Failures:</strong>
                        ${[1,2,3].map(i => `<input type="checkbox" id="wisp-fail-${i}">`).join('')}
                    </div>
                </div>
                <button onclick="stabilize('wisp')">Stabilize</button>
            </div>

            <div class="char-section">
                <h3>Combat Stats</h3>
                <div class="combat-stats">
                    <div class="combat-stat">
                        <strong>AC</strong>
                        <span>13</span>
                    </div>
                    <div class="combat-stat">
                        <strong>Speed</strong>
                        <span>30 ft</span>
                    </div>
                    <div class="combat-stat clickable" onclick="rollInitiative(0, 'Wisp')">
                        <strong>Initiative</strong>
                        <span>+0</span>
                    </div>
                </div>
            </div>

            <div id="roll-results-wisp" class="roll-results"></div>

            <div class="char-section">
                <h3>Hit Dice</h3>
                <div class="hit-dice-tracker">
                    <p><strong>Available:</strong> ${char.hitDice} / ${char.maxHitDice} d${char.hitDie}</p>
                    <button onclick="spendHitDice('wisp')" ${char.hitDice === 0 ? 'disabled' : ''}>
                        Spend Hit Die
                    </button>
                </div>
            </div>

            <div class="char-section">
                <h3>Spell Slots</h3>
                <div class="spell-slots-section">
                    ${Object.entries(char.spellSlots).filter(([level, slots]) => slots.max > 0).map(([level, slots]) => `
                        <div class="spell-level">
                            <strong>Level ${level}</strong>
                            <div class="slot-checkboxes">
                                ${Array.from({length: slots.max}, (_, i) => `
                                    <input type="checkbox" id="wisp-slot-${level}-${i+1}" 
                                        ${i < slots.current ? 'checked' : ''} 
                                        onchange="toggleSpellSlot('wisp', ${level}, ${i+1})">
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="rest-buttons">
                    <button onclick="shortRest('wisp')">Short Rest</button>
                    <button onclick="longRest('wisp')">Long Rest</button>
                </div>
            </div>

            <div class="char-section">
                <h3>Conditions</h3>
                <div class="conditions-tracker">
                    <div class="condition-select">
                        <select id="wisp-condition-select">
                            <option value="">-- Add Condition --</option>
                            <option value="blinded">Blinded</option>
                            <option value="charmed">Charmed</option>
                            <option value="deafened">Deafened</option>
                            <option value="frightened">Frightened</option>
                            <option value="grappled">Grappled</option>
                            <option value="incapacitated">Incapacitated</option>
                            <option value="invisible">Invisible</option>
                            <option value="paralyzed">Paralyzed</option>
                            <option value="petrified">Petrified</option>
                            <option value="poisoned">Poisoned</option>
                            <option value="prone">Prone</option>
                            <option value="restrained">Restrained</option>
                            <option value="stunned">Stunned</option>
                            <option value="unconscious">Unconscious</option>
                        </select>
                        <button onclick="addCondition('wisp')">Add</button>
                    </div>
                    <div id="wisp-active-conditions" class="active-conditions"></div>
                </div>
            </div>

            <div class="char-section">
                <h3>Personality</h3>
                <div class="catchphrase">"We chillin'"</div>
                <p>20,000 years old. Not a people person. Spontaneous and intuitive. Secretly controls ship telepathically.</p>
            </div>
        </div>
    `;
}

function rollAbilityCheck(modifier, ability, characterName) {
    const roll = Math.floor(Math.random() * 20) + 1;
    const total = roll + modifier;
    
    displayCharacterRoll(characterName, `${ability} Check`, roll, modifier, total);
    addToDiceHistory(1, 20, modifier, total);
}

function rollInitiative(modifier, charName) {
    const roll = Math.floor(Math.random() * 20) + 1;
    const total = roll + modifier;
    
    displayCharacterRoll(charName, 'Initiative', roll, modifier, total);
    addToDiceHistory(1, 20, modifier, total);
}

function displayCharacterRoll(characterName, rollType, roll, modifier, total) {
    const resultsDiv = document.getElementById(`roll-results-${characterName.toLowerCase()}`);
    if (!resultsDiv) return;
    
    const isCrit = roll === 20;
    const isFail = roll === 1;
    
    let critClass = '';
    let critEmoji = '';
    if (isCrit) {
        critClass = 'crit-success';
        critEmoji = '🎉 ';
    } else if (isFail) {
        critClass = 'crit-fail';
        critEmoji = '💀 ';
    }
    
    resultsDiv.innerHTML = `
        <div class="character-roll-result ${critClass}">
            <strong>${rollType}:</strong> ${critEmoji}${roll} ${modifier >= 0 ? '+' : ''}${modifier} = <span class="total">${total}</span>
        </div>
    `;
    
    // Clear after 5 seconds
    setTimeout(() => {
        if (resultsDiv.innerHTML.includes(rollType)) {
            resultsDiv.innerHTML = '';
        }
    }, 5000);
}

// ===== HP TRACKING =====
function modifyHP(characterName, amount) {
    const charKey = characterName.toLowerCase();
    const char = campaignData.characters[charKey];
    
    if (!char) return;
    
    if (amount < 0) {
        // Taking damage - subtract from temp HP first
        if (char.tempHp > 0) {
            const tempDamage = Math.min(Math.abs(amount), char.tempHp);
            char.tempHp -= tempDamage;
            amount += tempDamage;
        }
        char.currentHp = Math.max(0, char.currentHp + amount);
    } else {
        // Healing
        char.currentHp = Math.min(char.maxHp, char.currentHp + amount);
    }
    
    updateHPDisplay(charKey);
    saveCampaignData();
}

function updateHPDisplay(charKey) {
    const char = campaignData.characters[charKey];
    if (!char) return;
    
    const percentage = (char.currentHp / char.maxHp) * 100;
    
    const currentHpEl = document.getElementById(`${charKey}-hp-current`);
    const hpBarEl = document.getElementById(`${charKey}-hp-bar`);
    const tempHpEl = document.getElementById(`${charKey}-temp-hp`);
    
    if (currentHpEl) currentHpEl.textContent = char.currentHp;
    
    if (hpBarEl) {
        hpBarEl.style.width = `${percentage}%`;
        
        // Color code the HP bar
        if (percentage > 50) {
            hpBarEl.style.background = 'linear-gradient(90deg, var(--success-color), var(--secondary-color))';
        } else if (percentage > 25) {
            hpBarEl.style.background = 'linear-gradient(90deg, #f39c12, #e67e22)';
        } else {
            hpBarEl.style.background = 'linear-gradient(90deg, var(--accent-color), #c0392b)';
        }
    }
    
    if (tempHpEl) {
        tempHpEl.value = char.tempHp;
    }
    
    // Show/hide death saves if HP is 0
    const deathSavesEl = document.getElementById(`${charKey}-death-saves`);
    if (deathSavesEl) {
        deathSavesEl.style.display = char.currentHp === 0 ? 'block' : 'none';
    }
}

function applyTempHP(characterName) {
    const charKey = characterName.toLowerCase();
    const char = campaignData.characters[charKey];
    
    if (!char) return;
    
    const tempHpInput = document.getElementById(`${charKey}-temp-hp`);
    if (!tempHpInput) return;
    
    const newTempHp = parseInt(tempHpInput.value) || 0;
    
    // Temp HP doesn't stack - take the higher value
    char.tempHp = Math.max(char.tempHp, newTempHp);
    
    updateHPDisplay(charKey);
    saveCampaignData();
}

// ===== CAMPAIGN WIKI =====
function createNewPage() {
    currentWikiPage = null;
    document.getElementById('editor-title').textContent = 'New Page';
    document.getElementById('page-title-input').value = '';
    document.getElementById('page-content-input').value = '';
    document.getElementById('wiki-editor-modal').style.display = 'flex';
    previewMode = false;
    document.getElementById('page-preview').style.display = 'none';
    document.getElementById('page-content-input').style.display = 'block';
}

function saveWikiPage() {
    const title = document.getElementById('page-title-input').value.trim();
    const content = document.getElementById('page-content-input').value;
    
    if (!title) {
        alert('Please enter a page title');
        return;
    }
    
    if (currentWikiPage) {
        const page = campaignData.wikiPages.find(p => p.id === currentWikiPage);
        if (page) {
            page.title = title;
            page.content = content;
            page.modified = Date.now();
        }
    } else {
        const page = {
            id: Date.now().toString(),
            title: title,
            content: content,
            created: Date.now(),
            modified: Date.now()
        };
        campaignData.wikiPages.push(page);
    }
    
    saveCampaignData();
    updateWikiSidebar();
    closeWikiEditor();
    
    const pageId = currentWikiPage || campaignData.wikiPages[campaignData.wikiPages.length - 1].id;
    openWikiPage(pageId);
}

function openWikiPage(pageId) {
    const page = campaignData.wikiPages.find(p => p.id === pageId);
    if (!page) return;
    
    showSection('wiki');
    
    const content = document.getElementById('wiki-content');
    const renderedContent = renderWikiContent(page.content);
    
    content.innerHTML = `
        <div class="wiki-page">
            <div class="wiki-page-header">
                <h1>${page.title}</h1>
                <div class="wiki-page-actions">
                    <button onclick="editWikiPage('${page.id}')">✏️ Edit</button>
                    <button onclick="deleteWikiPage('${page.id}')">🗑️ Delete</button>
                </div>
            </div>
            <div class="wiki-page-meta">
                <span>Created: ${new Date(page.created).toLocaleDateString()}</span>
                <span>Modified: ${new Date(page.modified).toLocaleDateString()}</span>
            </div>
            <div class="wiki-page-content">
                ${renderedContent}
            </div>
        </div>
    `;
    
    updateBacklinks(page.title);
}

function renderWikiContent(content) {
    // Convert markdown to HTML
    let html = marked.parse(content);
    
    // Convert [[wiki links]] to clickable links
    html = html.replace(/\[\[([^\]]+)\]\]/g, (match, pageName) => {
        const page = campaignData.wikiPages.find(p => 
            p.title.toLowerCase() === pageName.toLowerCase()
        );
        if (page) {
            return `<a href="#" onclick="openWikiPage('${page.id}'); return false;" class="wiki-link">${pageName}</a>`;
        } else {
            return `<a href="#" onclick="createPageFromLink('${pageName}'); return false;" class="wiki-link-new">${pageName}</a>`;
        }
    });
    
    // Convert #tags to styled tags
    html = html.replace(/#(\w+)/g, '<span class="wiki-tag" onclick="searchWikiByTag(\'$1\')">#$1</span>');
    
    return html;
}

function editWikiPage(pageId) {
    const page = campaignData.wikiPages.find(p => p.id === pageId);
    if (!page) return;
    
    currentWikiPage = pageId;
    document.getElementById('editor-title').textContent = 'Edit Page';
    document.getElementById('page-title-input').value = page.title;
    document.getElementById('page-content-input').value = page.content;
    document.getElementById('wiki-editor-modal').style.display = 'flex';
}

function deleteWikiPage(pageId) {
    if (!confirm('Are you sure you want to delete this page?')) return;
    
    campaignData.wikiPages = campaignData.wikiPages.filter(p => p.id !== pageId);
    saveCampaignData();
    updateWikiSidebar();
    
    document.getElementById('wiki-content').innerHTML = `
        <div class="wiki-welcome">
            <h2>📚 Campaign Wiki</h2>
            <p>Page deleted. Create a new page or select one from the sidebar.</p>
        </div>
    `;
}

function createPageFromLink(pageName) {
    currentWikiPage = null;
    document.getElementById('editor-title').textContent = 'New Page';
    document.getElementById('page-title-input').value = pageName;
    document.getElementById('page-content-input').value = '';
    document.getElementById('wiki-editor-modal').style.display = 'flex';
}

function closeWikiEditor() {
    document.getElementById('wiki-editor-modal').style.display = 'none';
}

function insertMarkdown(before, after) {
    const textarea = document.getElementById('page-content-input');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    
    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
    textarea.value = newText;
    textarea.focus();
    textarea.setSelectionRange(start + before.length, end + before.length);
}

function togglePreview() {
    previewMode = !previewMode;
    const textarea = document.getElementById('page-content-input');
    const preview = document.getElementById('page-preview');
    const btn = document.getElementById('preview-btn');
    
    if (previewMode) {
        preview.innerHTML = renderWikiContent(textarea.value);
        preview.style.display = 'block';
        textarea.style.display = 'none';
        btn.textContent = '✏️ Edit';
    } else {
        preview.style.display = 'none';
        textarea.style.display = 'block';
        btn.textContent = '👁️ Preview';
    }
}

function updateWikiSidebar() {
    // Update pages list
    const pagesList = document.getElementById('wiki-pages-list');
    if (campaignData.wikiPages.length === 0) {
        pagesList.innerHTML = '<p class="empty-state">No pages yet</p>';
    } else {
        let html = '<ul class="wiki-pages-ul">';
        campaignData.wikiPages.forEach(page => {
            html += `<li onclick="openWikiPage('${page.id}')">${page.title}</li>`;
        });
        html += '</ul>';
        pagesList.innerHTML = html;
    }
    
    // Update tags list
    const tags = new Set();
    campaignData.wikiPages.forEach(page => {
        const matches = page.content.match(/#(\w+)/g);
        if (matches) {
            matches.forEach(tag => tags.add(tag));
        }
    });
    
    const tagsList = document.getElementById('wiki-tags-list');
    if (tags.size === 0) {
        tagsList.innerHTML = '<p class="empty-state">No tags yet</p>';
    } else {
        let html = '<div class="wiki-tags-container">';
        tags.forEach(tag => {
            html += `<span class="wiki-tag" onclick="searchWikiByTag('${tag.substring(1)}')">${tag}</span>`;
        });
        html += '</div>';
        tagsList.innerHTML = html;
    }
}

function searchWiki() {
    const query = document.getElementById('wiki-search-input').value.toLowerCase();
    if (!query) {
        updateWikiSidebar();
        return;
    }
    
    const results = campaignData.wikiPages.filter(page =>
        page.title.toLowerCase().includes(query) ||
        page.content.toLowerCase().includes(query)
    );
    
    const pagesList = document.getElementById('wiki-pages-list');
    if (results.length === 0) {
        pagesList.innerHTML = '<p class="empty-state">No results found</p>';
    } else {
        let html = '<ul class="wiki-pages-ul">';
        results.forEach(page => {
            html += `<li onclick="openWikiPage('${page.id}')">${page.title}</li>`;
        });
        html += '</ul>';
        pagesList.innerHTML = html;
    }
}

function searchWikiByTag(tag) {
    const results = campaignData.wikiPages.filter(page =>
        page.content.includes(`#${tag}`)
    );
    
    const pagesList = document.getElementById('wiki-pages-list');
    if (results.length === 0) {
        pagesList.innerHTML = '<p class="empty-state">No pages with this tag</p>';
    } else {
        let html = '<ul class="wiki-pages-ul">';
        results.forEach(page => {
            html += `<li onclick="openWikiPage('${page.id}')">${page.title}</li>`;
        });
        html += '</ul>';
        pagesList.innerHTML = html;
    }
}

function updateBacklinks(pageTitle) {
    const backlinks = campaignData.wikiPages.filter(page =>
        page.content.includes(`[[${pageTitle}]]`)
    );
    
    const backlinksDiv = document.getElementById('wiki-backlinks-list');
    if (backlinks.length === 0) {
        backlinksDiv.innerHTML = '<p class="empty-state">No backlinks</p>';
    } else {
        let html = '<ul class="backlinks-ul">';
        backlinks.forEach(page => {
            html += `<li onclick="openWikiPage('${page.id}')">${page.title}</li>`;
        });
        html += '</ul>';
        backlinksDiv.innerHTML = html;
    }
}

// ===== GRAPH VIEW =====
function showGraphView() {
    document.getElementById('graph-modal').style.display = 'flex';
    setTimeout(() => renderGraph(), 100);
}

function closeGraphView() {
    document.getElementById('graph-modal').style.display = 'none';
    if (graphNetwork) {
        graphNetwork.destroy();
        graphNetwork = null;
    }
}

function renderGraph() {
    const nodes = [];
    const edges = [];
    
    campaignData.wikiPages.forEach(page => {
        nodes.push({
            id: page.id,
            label: page.title,
            title: page.title
        });
        
        const links = page.content.match(/\[\[([^\]]+)\]\]/g);
        if (links) {
            links.forEach(link => {
                const targetTitle = link.slice(2, -2);
                const targetPage = campaignData.wikiPages.find(p =>
                    p.title.toLowerCase() === targetTitle.toLowerCase()
                );
                if (targetPage) {
                    edges.push({
                        from: page.id,
                        to: targetPage.id
                    });
                }
            });
        }
    });
    
    const container = document.getElementById('graph-container');
    const data = { nodes, edges };
    const options = {
        nodes: {
            shape: 'dot',
            size: 16,
            font: {
                size: 14
            }
        },
        edges: {
            arrows: 'to',
            smooth: true
        },
        physics: {
            stabilization: false,
            barnesHut: {
                gravitationalConstant: -2000,
                springConstant: 0.001,
                springLength: 200
            }
        }
    };
    
    graphNetwork = new vis.Network(container, data, options);
    
    graphNetwork.on('click', function(params) {
        if (params.nodes.length > 0) {
            const pageId = params.nodes[0];
            closeGraphView();
            openWikiPage(pageId);
        }
    });
}

// ===== COMBAT TRACKER =====
function showSessionTab(tabName) {
    document.querySelectorAll('.session-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.session-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    const activeTab = document.querySelector(`[onclick*="'${tabName}'"]`);
    if (activeTab) activeTab.classList.add('active');
    document.getElementById(tabName === 'combat' ? 'combat-tracker' : 'session-notes-tab').classList.add('active');
}

function startCombat() {
    if (campaignData.combat.combatants.length === 0) {
        alert('Add combatants first!');
        return;
    }
    
    campaignData.combat.active = true;
    campaignData.combat.round = 1;
    campaignData.combat.currentTurn = 0;
    
    // Sort by initiative
    campaignData.combat.combatants.sort((a, b) => b.initiative - a.initiative);
    
    document.getElementById('next-turn-btn').disabled = false;
    document.getElementById('end-combat-btn').disabled = false;
    document.getElementById('combat-round-info').style.display = 'flex';
    
    updateCombatDisplay();
    saveCampaignData();
}

function nextTurn() {
    campaignData.combat.currentTurn++;
    
    if (campaignData.combat.currentTurn >= campaignData.combat.combatants.length) {
        campaignData.combat.currentTurn = 0;
        campaignData.combat.round++;
    }
    
    updateCombatDisplay();
    saveCampaignData();
}

function endCombat() {
    if (!confirm('End combat?')) return;
    
    campaignData.combat.active = false;
    campaignData.combat.round = 1;
    campaignData.combat.currentTurn = 0;
    campaignData.combat.combatants = [];
    
    document.getElementById('next-turn-btn').disabled = true;
    document.getElementById('end-combat-btn').disabled = true;
    document.getElementById('combat-round-info').style.display = 'none';
    
    updateCombatDisplay();
    saveCampaignData();
}

function addCombatant() {
    const name = prompt('Combatant name:');
    if (!name) return;
    
    const initiative = parseInt(prompt('Initiative roll:', '10'));
    const hp = parseInt(prompt('Max HP:', '20'));
    
    campaignData.combat.combatants.push({
        id: Date.now(),
        name: name,
        initiative: initiative,
        maxHp: hp,
        currentHp: hp,
        conditions: []
    });
    
    updateCombatDisplay();
    saveCampaignData();
}

function removeCombatant(id) {
    campaignData.combat.combatants = campaignData.combat.combatants.filter(c => c.id !== id);
    updateCombatDisplay();
    saveCampaignData();
}

function updateCombatantHp(id, change) {
    const combatant = campaignData.combat.combatants.find(c => c.id === id);
    if (combatant) {
        combatant.currentHp = Math.max(0, Math.min(combatant.maxHp, combatant.currentHp + change));
        updateCombatDisplay();
        saveCampaignData();
    }
}

function updateCombatDisplay() {
    const listDiv = document.getElementById('initiative-list');
    
    if (campaignData.combat.combatants.length === 0) {
        listDiv.innerHTML = '<p class="empty-state">No combatants. Click "Add Combatant" to begin.</p>';
        return;
    }
    
    document.getElementById('combat-round').textContent = campaignData.combat.round;
    
    if (campaignData.combat.active && campaignData.combat.combatants.length > 0) {
        const currentCombatant = campaignData.combat.combatants[campaignData.combat.currentTurn];
        document.getElementById('current-turn-name').textContent = currentCombatant.name;
    }
    
    let html = '';
    campaignData.combat.combatants.forEach((combatant, index) => {
        const isActive = campaignData.combat.active && index === campaignData.combat.currentTurn;
        const hpPercent = (combatant.currentHp / combatant.maxHp) * 100;
        
        html += `
            <div class="combatant-card ${isActive ? 'active-turn' : ''}">
                <div class="combatant-header">
                    <h4>${combatant.name}</h4>
                    <span class="initiative-badge">${combatant.initiative}</span>
                </div>
                <div class="combatant-hp">
                    <div class="hp-bar-container">
                        <div class="hp-bar" style="width: ${hpPercent}%"></div>
                    </div>
                    <span class="hp-text">${combatant.currentHp} / ${combatant.maxHp} HP</span>
                </div>
                <div class="combatant-actions">
                    <button onclick="updateCombatantHp(${combatant.id}, -5)">-5</button>
                    <button onclick="updateCombatantHp(${combatant.id}, -1)">-1</button>
                    <button onclick="updateCombatantHp(${combatant.id}, 1)">+1</button>
                    <button onclick="updateCombatantHp(${combatant.id}, 5)">+5</button>
                    <button onclick="removeCombatant(${combatant.id})">✕</button>
                </div>
            </div>
        `;
    });
    
    listDiv.innerHTML = html;
}

// ===== SESSION NOTES =====
function addSessionNote() {
    const sessionNumber = campaignData.sessions.length + 1;
    const session = {
        id: Date.now(),
        number: sessionNumber,
        date: new Date().toLocaleDateString(),
        notes: '',
        editing: true
    };
    
    campaignData.sessions.unshift(session);
    saveCampaignData();
    updateSessionsDisplay();
}

function deleteSession(id) {
    if (!confirm('Delete this session?')) return;
    
    campaignData.sessions = campaignData.sessions.filter(s => s.id !== id);
    campaignData.sessions.reverse().forEach((s, index) => {
        s.number = index + 1;
    });
    campaignData.sessions.reverse();
    
    saveCampaignData();
    updateSessionsDisplay();
}

function toggleEditSession(id) {
    const session = campaignData.sessions.find(s => s.id === id);
    if (session) {
        session.editing = !session.editing;
        updateSessionsDisplay();
    }
}

function saveSessionNotes(id) {
    const session = campaignData.sessions.find(s => s.id === id);
    if (session) {
        const textarea = document.getElementById(`session-notes-${id}`);
        session.notes = textarea.value;
        session.editing = false;
        saveCampaignData();
        updateSessionsDisplay();
    }
}

function updateSessionsDisplay() {
    const listDiv = document.getElementById('sessions-list');
    
    if (campaignData.sessions.length === 0) {
        listDiv.innerHTML = '<p class="empty-state">No sessions recorded yet.</p>';
        return;
    }
    
    let html = '';
    campaignData.sessions.forEach(session => {
        html += `
            <div class="session-card">
                <div class="session-header">
                    <h3>Session ${session.number}</h3>
                    <div>
                        <span class="session-date">${session.date}</span>
                        <div class="session-controls-inline">
                            ${session.editing ? 
                                `<button onclick="saveSessionNotes(${session.id})">💾 Save</button>` :
                                `<button onclick="toggleEditSession(${session.id})">✏️ Edit</button>`
                            }
                            <button onclick="deleteSession(${session.id})">🗑️</button>
                        </div>
                    </div>
                </div>
                <div class="session-content">
                    ${session.editing ?
                        `<textarea id="session-notes-${session.id}" placeholder="Session notes...">${session.notes}</textarea>` :
                        `<div style="white-space: pre-wrap;">${session.notes || '<em>No notes</em>'}</div>`
                    }
                </div>
            </div>
        `;
    });
    
    listDiv.innerHTML = html;
}

function exportNotes() {
    if (campaignData.sessions.length === 0) {
        alert('No sessions to export!');
        return;
    }
    
    let exportText = '# FeySpace Campaign - Session Notes\n\n';
    
    campaignData.sessions.slice().reverse().forEach(session => {
        exportText += `## Session ${session.number} (${session.date})\n\n`;
        exportText += session.notes ? session.notes + '\n\n' : '*No notes*\n\n';
        exportText += '---\n\n';
    });
    
    const blob = new Blob([exportText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'feyspace-session-notes.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ===== DICE ROLLER =====
function rollDice(sides) {
    const advantage = document.getElementById('advantage')?.checked;
    const disadvantage = document.getElementById('disadvantage')?.checked;
    
    let roll = Math.floor(Math.random() * sides) + 1;
    
    if (advantage || disadvantage) {
        const roll2 = Math.floor(Math.random() * sides) + 1;
        roll = advantage ? Math.max(roll, roll2) : Math.min(roll, roll2);
    }
    
    displayDiceResult(1, sides, 0, [roll], roll);
    addToDiceHistory(1, sides, 0, roll);
}

function rollCustomDice() {
    const numDice = parseInt(document.getElementById('num-dice').value);
    const sides = parseInt(document.getElementById('dice-sides').value);
    const modifier = parseInt(document.getElementById('dice-modifier').value);
    
    const rolls = [];
    for (let i = 0; i < numDice; i++) {
        rolls.push(Math.floor(Math.random() * sides) + 1);
    }
    
    const sum = rolls.reduce((a, b) => a + b, 0);
    const total = sum + modifier;
    
    displayDiceResult(numDice, sides, modifier, rolls, total);
    addToDiceHistory(numDice, sides, modifier, total);
}

function displayDiceResult(numDice, sides, modifier, rolls, total) {
    const resultDiv = document.getElementById('dice-result');
    
    // Check for critical success/failure (only for d20 rolls)
    let critClass = '';
    let critEmoji = '';
    if (sides === 20 && numDice === 1) {
        if (rolls[0] === 20) {
            critClass = 'crit-success';
            critEmoji = '🎉 ';
        } else if (rolls[0] === 1) {
            critClass = 'crit-fail';
            critEmoji = '💀 ';
        }
    }
    
    let detailText = '';
    if (numDice > 1 || modifier !== 0) {
        detailText = `(${rolls.join(' + ')}`;
        if (modifier > 0) detailText += ` + ${modifier}`;
        else if (modifier < 0) detailText += ` ${modifier}`;
        detailText += ')';
    }
    
    // Add rolling animation class temporarily
    resultDiv.classList.add('dice-rolling');
    setTimeout(() => resultDiv.classList.remove('dice-rolling'), 300);
    
    resultDiv.innerHTML = `
        <div class="dice-result-display ${critClass}" style="font-size: 2.5rem; font-weight: bold; padding: 1rem; border-radius: 8px; margin: 0.5rem 0;">
            ${critEmoji}${total}
        </div>
        <div style="font-size: 1rem; color: #666;">${numDice}d${sides}${modifier !== 0 ? (modifier > 0 ? '+' + modifier : modifier) : ''} ${detailText}</div>
    `;
}

function addToDiceHistory(numDice, sides, modifier, total) {
    const timestamp = new Date().toLocaleTimeString();
    const entry = {
        roll: `${numDice}d${sides}${modifier !== 0 ? (modifier > 0 ? '+' + modifier : modifier) : ''}`,
        result: total,
        time: timestamp,
        numDice: numDice,
        sides: sides,
        modifier: modifier
    };
    
    diceHistory.unshift(entry);
    if (diceHistory.length > 10) diceHistory.pop();
    
    // Save to localStorage
    localStorage.setItem('feyspace-dice-history', JSON.stringify(diceHistory));
    
    updateDiceHistory();
}

function updateDiceHistory() {
    const historyDiv = document.getElementById('dice-history');
    
    if (diceHistory.length === 0) {
        historyDiv.innerHTML = '<p style="color: #999; font-style: italic;">No rolls yet</p>';
        return;
    }
    
    let html = '<div style="margin-top: 1rem; border-top: 1px solid var(--border-color); padding-top: 0.5rem;">';
    html += '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">';
    html += '<strong>Recent Rolls:</strong>';
    html += '<button onclick="clearDiceHistory()" style="font-size: 0.8rem; padding: 0.2rem 0.5rem;">Clear</button>';
    html += '</div>';
    
    diceHistory.forEach((entry, index) => {
        html += `<div style="padding: 0.25rem 0; display: flex; justify-content: space-between; align-items: center;">
            <span>${entry.roll}: <strong>${entry.result}</strong></span>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
                <button onclick="rerollFromHistory(${index})" style="font-size: 0.8rem; padding: 0.2rem 0.5rem;" title="Re-roll">↻</button>
                <span style="color: #999; font-size: 0.8rem;">${entry.time}</span>
            </div>
        </div>`;
    });
    
    html += '</div>';
    historyDiv.innerHTML = html;
}

function clearDiceHistory() {
    if (confirm('Clear all dice history?')) {
        diceHistory = [];
        localStorage.removeItem('feyspace-dice-history');
        updateDiceHistory();
    }
}

function rerollFromHistory(index) {
    const entry = diceHistory[index];
    if (!entry) return;
    
    // Set the form values
    document.getElementById('num-dice').value = entry.numDice;
    document.getElementById('dice-sides').value = entry.sides;
    document.getElementById('dice-modifier').value = entry.modifier;
    
    // Perform the roll
    rollCustomDice();
}

// ===== DICE PRESETS =====
function saveCurrentRoll() {
    const numDice = parseInt(document.getElementById('num-dice').value);
    const sides = parseInt(document.getElementById('dice-sides').value);
    const modifier = parseInt(document.getElementById('dice-modifier').value);
    
    const name = prompt('Name this roll preset:');
    if (!name || !name.trim()) return;
    
    const preset = {
        id: Date.now(),
        name: name.trim(),
        numDice: numDice,
        sides: sides,
        modifier: modifier,
        roll: `${numDice}d${sides}${modifier !== 0 ? (modifier > 0 ? '+' + modifier : modifier) : ''}`
    };
    
    dicePresets.push(preset);
    localStorage.setItem('feyspace-dice-presets', JSON.stringify(dicePresets));
    updatePresetsList();
}

function loadPreset(id) {
    const preset = dicePresets.find(p => p.id === id);
    if (!preset) return;
    
    document.getElementById('num-dice').value = preset.numDice;
    document.getElementById('dice-sides').value = preset.sides;
    document.getElementById('dice-modifier').value = preset.modifier;
    
    rollCustomDice();
}

function deletePreset(id) {
    if (!confirm('Delete this preset?')) return;
    
    dicePresets = dicePresets.filter(p => p.id !== id);
    localStorage.setItem('feyspace-dice-presets', JSON.stringify(dicePresets));
    updatePresetsList();
}

function updatePresetsList() {
    const listDiv = document.getElementById('preset-rolls-list');
    
    if (dicePresets.length === 0) {
        listDiv.innerHTML = '<p style="color: #999; font-style: italic; font-size: 0.9rem;">No saved rolls yet</p>';
        return;
    }
    
    let html = '';
    dicePresets.forEach(preset => {
        html += `
            <div class="preset-item" style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; background: rgba(255,255,255,0.05); border-radius: 4px; margin-bottom: 0.5rem;">
                <div>
                    <strong>${preset.name}</strong>
                    <span style="color: #999; margin-left: 0.5rem;">${preset.roll}</span>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button onclick="loadPreset(${preset.id})" style="font-size: 0.8rem; padding: 0.2rem 0.5rem;">Roll</button>
                    <button onclick="deletePreset(${preset.id})" style="font-size: 0.8rem; padding: 0.2rem 0.5rem;">✕</button>
                </div>
            </div>
        `;
    });
    
    listDiv.innerHTML = html;
}

// ===== INVENTORY =====
function addInventoryItem() {
    const nameInput = document.getElementById('item-name');
    const quantityInput = document.getElementById('item-quantity');
    const weightInput = document.getElementById('item-weight');
    
    const name = nameInput.value.trim();
    const quantity = parseInt(quantityInput.value);
    const weight = parseFloat(weightInput.value) || 0;
    
    if (!name) {
        alert('Please enter an item name');
        return;
    }
    
    const existing = campaignData.inventory.find(item => item.name.toLowerCase() === name.toLowerCase());
    
    if (existing) {
        existing.quantity += quantity;
    } else {
        campaignData.inventory.push({
            id: Date.now(),
            name: name,
            quantity: quantity,
            weight: weight
        });
    }
    
    saveCampaignData();
    updateInventoryDisplay();
    
    nameInput.value = '';
    quantityInput.value = '1';
    weightInput.value = '';
}

function removeInventoryItem(id) {
    campaignData.inventory = campaignData.inventory.filter(item => item.id !== id);
    saveCampaignData();
    updateInventoryDisplay();
}

function updateInventoryQuantity(id, change) {
    const item = campaignData.inventory.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeInventoryItem(id);
        } else {
            saveCampaignData();
            updateInventoryDisplay();
        }
    }
}

function updateInventoryDisplay() {
    const listDiv = document.getElementById('inventory-list');
    
    if (campaignData.inventory.length === 0) {
        listDiv.innerHTML = '<p class="empty-state">No items in inventory</p>';
        document.getElementById('total-weight').textContent = '0';
        return;
    }
    
    let totalWeight = 0;
    let html = '';
    
    campaignData.inventory.forEach(item => {
        totalWeight += item.weight * item.quantity;
        html += `
            <div class="inventory-item">
                <div>
                    <strong>${item.name}</strong>
                    <span style="color: #666; margin-left: 0.5rem;">x${item.quantity}</span>
                    ${item.weight > 0 ? `<span style="color: #999; margin-left: 0.5rem;">(${item.weight} lbs)</span>` : ''}
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button onclick="updateInventoryQuantity(${item.id}, -1)">-</button>
                    <button onclick="updateInventoryQuantity(${item.id}, 1)">+</button>
                    <button onclick="removeInventoryItem(${item.id})">✕</button>
                </div>
            </div>
        `;
    });
    
    listDiv.innerHTML = html;
    document.getElementById('total-weight').textContent = totalWeight.toFixed(1);
}

// ===== LEVEL PROGRESS =====
function addMilestone() {
    const milestoneName = prompt('What milestone was completed?');
    
    if (!milestoneName || !milestoneName.trim()) return;
    
    campaignData.levelProgress.milestonesCompleted++;
    campaignData.levelProgress.milestones.unshift({
        id: Date.now(),
        name: milestoneName.trim(),
        date: new Date().toLocaleDateString()
    });
    
    if (campaignData.levelProgress.milestonesCompleted >= campaignData.levelProgress.milestonesNeeded) {
        campaignData.levelProgress.currentLevel++;
        campaignData.levelProgress.milestonesCompleted = 0;
        campaignData.level = campaignData.levelProgress.currentLevel;
        alert(`🎉 Level Up! The party is now Level ${campaignData.levelProgress.currentLevel}!`);
    }
    
    saveCampaignData();
    updateLevelProgressDisplay();
    updateDashboard();
}

function resetMilestones() {
    if (!confirm('Reset milestone progress?')) return;
    
    campaignData.levelProgress.milestonesCompleted = 0;
    saveCampaignData();
    updateLevelProgressDisplay();
}

function updateLevelProgressDisplay() {
    document.getElementById('current-level').textContent = campaignData.levelProgress.currentLevel;
    document.getElementById('milestones-completed').textContent = campaignData.levelProgress.milestonesCompleted;
    document.getElementById('milestones-needed').textContent = campaignData.levelProgress.milestonesNeeded;
    
    const percentage = (campaignData.levelProgress.milestonesCompleted / campaignData.levelProgress.milestonesNeeded) * 100;
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = `${percentage}%`;
    progressBar.textContent = `${campaignData.levelProgress.milestonesCompleted} / ${campaignData.levelProgress.milestonesNeeded}`;
    
    const listDiv = document.getElementById('milestone-list');
    
    if (campaignData.levelProgress.milestones.length === 0) {
        listDiv.innerHTML = '<p class="empty-state">No milestones yet</p>';
        return;
    }
    
    let html = '<h4>Recent Milestones:</h4>';
    campaignData.levelProgress.milestones.slice(0, 5).forEach(milestone => {
        html += `
            <div class="milestone-item">
                <strong>${milestone.name}</strong>
                <div style="font-size: 0.9rem; color: #666;">${milestone.date}</div>
            </div>
        `;
    });
    
    listDiv.innerHTML = html;
}

// ===== ENCOUNTER BUILDER =====
function generateEncounter() {
    const level = parseInt(document.getElementById('encounter-level').value);
    const partySize = parseInt(document.getElementById('party-size').value);
    const difficulty = document.getElementById('encounter-difficulty').value;
    
    const xpThresholds = {
        easy: [25, 50, 75, 125, 250, 300, 350, 450, 550, 600],
        medium: [50, 100, 150, 250, 500, 600, 750, 900, 1100, 1200],
        hard: [75, 150, 225, 375, 750, 900, 1100, 1400, 1600, 1900],
        deadly: [100, 200, 400, 500, 1100, 1400, 1700, 2100, 2400, 2800]
    };
    
    const xpPerPlayer = xpThresholds[difficulty][Math.min(level - 1, 9)];
    const totalXP = xpPerPlayer * partySize;
    
    const resultDiv = document.getElementById('encounter-result');
    resultDiv.innerHTML = `
        <div class="encounter-summary">
            <h4>Encounter Budget</h4>
            <p><strong>Total XP:</strong> ${totalXP}</p>
            <p><strong>Difficulty:</strong> ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</p>
            <p>Use this XP budget to select monsters from the Compendium.</p>
        </div>
    `;
}

// ===== COMPENDIUM =====
const compendiumData = {
    spells: [
        // === FEYWILD SPELLS ===
        {
            name: "Fey Step",
            level: 2,
            school: "Conjuration",
            castingTime: "1 bonus action",
            range: "Self",
            components: "V",
            duration: "Instantaneous",
            description: "You teleport up to 30 feet to an unoccupied space you can see. You briefly shimmer with silvery mist as you vanish and reappear. This spell taps into the natural magic of the Feywild, allowing you to slip between spaces as the fey do.",
            higherLevels: "When you cast this spell using a spell slot of 3rd level or higher, the distance increases by 10 feet for each slot level above 2nd."
        },
        {
            name: "Moonbeam",
            level: 2,
            school: "Evocation",
            castingTime: "1 action",
            range: "120 feet",
            components: "V, S, M (several seeds of any moonseed plant and a piece of opalescent feldspar)",
            duration: "Concentration, up to 1 minute",
            description: "A silvery beam of pale light shines down in a 5-foot-radius, 40-foot-high cylinder centered on a point within range. Until the spell ends, dim light fills the cylinder. When a creature enters the spell's area for the first time on a turn or starts its turn there, it must make a Constitution saving throw. It takes 2d10 radiant damage on a failed save, or half as much on a successful one. A shapechanger makes its saving throw with disadvantage. If it fails, it instantly reverts to its original form and can't assume a different form until it leaves the spell's light.",
            higherLevels: "When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d10 for each slot level above 2nd."
        },
        {
            name: "Summon Fey",
            level: 3,
            school: "Conjuration",
            castingTime: "1 action",
            range: "90 feet",
            components: "V, S, M (a gilded flower worth at least 300 gp)",
            duration: "Concentration, up to 1 hour",
            description: "You call forth a fey spirit. It manifests in an unoccupied space that you can see within range. This corporeal form uses the Fey Spirit stat block. When you cast the spell, choose a mood: Fuming, Mirthful, or Tricksy. The creature resembles a fey creature of your choice marked by the chosen mood, which determines certain traits in its stat block. The creature disappears when it drops to 0 hit points or when the spell ends.",
            higherLevels: "When you cast this spell using a spell slot of 4th level or higher, use the higher level wherever the spell's level appears in the stat block."
        },
        {
            name: "Charm Monster",
            level: 4,
            school: "Enchantment",
            castingTime: "1 action",
            range: "30 feet",
            components: "V, S",
            duration: "1 hour",
            description: "You attempt to charm a creature you can see within range. It must make a Wisdom saving throw, and it does so with advantage if you or your companions are fighting it. If it fails the saving throw, it is charmed by you until the spell ends or until you or your companions do anything harmful to it. The charmed creature is friendly to you. When the spell ends, the creature knows it was charmed by you.",
            higherLevels: "When you cast this spell using a spell slot of 5th level or higher, you can target one additional creature for each slot level above 4th."
        },
        {
            name: "Conjure Woodland Beings",
            level: 4,
            school: "Conjuration",
            castingTime: "1 action",
            range: "60 feet",
            components: "V, S, M (one holly berry per creature summoned)",
            duration: "Concentration, up to 1 hour",
            description: "You summon fey creatures that appear in unoccupied spaces that you can see within range. Choose one of the following options: One fey creature of CR 2 or lower, Two fey creatures of CR 1 or lower, Four fey creatures of CR 1/2 or lower, Eight fey creatures of CR 1/4 or lower. The summoned creatures are friendly to you and your companions. Roll initiative for the summoned creatures as a group. They obey any verbal commands that you issue to them. If you don't issue any commands, they defend themselves from hostile creatures but otherwise take no actions.",
            higherLevels: "When you cast this spell using certain higher-level spell slots, you choose one of the summoning options above, and more creatures appear: twice as many with a 6th-level slot and three times as many with an 8th-level slot."
        },
        {
            name: "Faerie Fire",
            level: 1,
            school: "Evocation",
            castingTime: "1 action",
            range: "60 feet",
            components: "V",
            duration: "Concentration, up to 1 minute",
            description: "Each object in a 20-foot cube within range is outlined in blue, green, or violet light (your choice). Any creature in the area when the spell is cast is also outlined in light if it fails a Dexterity saving throw. For the duration, objects and affected creatures shed dim light in a 10-foot radius. Any attack roll against an affected creature or object has advantage if the attacker can see it, and the affected creature or object can't benefit from being invisible.",
            higherLevels: ""
        },
        {
            name: "Entangle",
            level: 1,
            school: "Conjuration",
            castingTime: "1 action",
            range: "90 feet",
            components: "V, S",
            duration: "Concentration, up to 1 minute",
            description: "Grasping weeds and vines sprout from the ground in a 20-foot square starting from a point within range. For the duration, these plants turn the ground in the area into difficult terrain. A creature in the area when you cast the spell must succeed on a Strength saving throw or be restrained by the entangling plants until the spell ends. A creature restrained by the plants can use its action to make a Strength check against your spell save DC. On a success, it frees itself.",
            higherLevels: ""
        },
        {
            name: "Barkskin",
            level: 2,
            school: "Transmutation",
            castingTime: "1 action",
            range: "Touch",
            components: "V, S, M (a handful of oak bark)",
            duration: "Concentration, up to 1 hour",
            description: "You touch a willing creature. Until the spell ends, the target's skin has a rough, bark-like appearance, and the target's AC can't be less than 16, regardless of what kind of armor it is wearing.",
            higherLevels: ""
        },
        {
            name: "Polymorph",
            level: 4,
            school: "Transmutation",
            castingTime: "1 action",
            range: "60 feet",
            components: "V, S, M (a caterpillar cocoon)",
            duration: "Concentration, up to 1 hour",
            description: "This spell transforms a creature that you can see within range into a new form. An unwilling creature must make a Wisdom saving throw to avoid the effect. The spell has no effect on a shapechanger or a creature with 0 hit points. The transformation lasts for the duration, or until the target drops to 0 hit points or dies. The new form can be any beast whose challenge rating is equal to or less than the target's (or the target's level, if it doesn't have a challenge rating).",
            higherLevels: ""
        },
        {
            name: "Mislead",
            level: 5,
            school: "Illusion",
            castingTime: "1 action",
            range: "Self",
            components: "S",
            duration: "Concentration, up to 1 hour",
            description: "You become invisible at the same time that an illusory double of you appears where you are standing. The double lasts for the duration, but the invisibility ends if you attack or cast a spell. You can use your action to move your illusory double up to twice your speed and make it gesture, speak, and behave in whatever way you choose. You can see through its eyes and hear through its ears as if you were located where it is.",
            higherLevels: ""
        },
        {
            name: "Dream",
            level: 5,
            school: "Illusion",
            castingTime: "1 minute",
            range: "Special",
            components: "V, S, M (a handful of sand, a dab of ink, and a writing quill plucked from a sleeping bird)",
            duration: "8 hours",
            description: "This spell shapes a creature's dreams. Choose a creature known to you as the target of this spell. The target must be on the same plane of existence as you. Creatures that don't sleep, such as elves, can't be contacted by this spell. You, or a willing creature you touch, enters a trance state, acting as a messenger. While in the trance, the messenger is aware of their surroundings, but can't take actions or move. If the target is asleep, the messenger appears in the target's dreams and can converse with the target as long as it remains asleep, through the duration of the spell.",
            higherLevels: ""
        },
        {
            name: "Seeming",
            level: 5,
            school: "Illusion",
            castingTime: "1 action",
            range: "30 feet",
            components: "V, S",
            duration: "8 hours",
            description: "This spell allows you to change the appearance of any number of creatures that you can see within range. You give each target you choose a new, illusory appearance. An unwilling target can make a Charisma saving throw, and if it succeeds, it is unaffected by this spell. The spell disguises physical appearance as well as clothing, armor, weapons, and equipment. You can make each creature seem 1 foot shorter or taller and appear thin, fat, or in between. You can't change a target's body type, so you must choose a form that has the same basic arrangement of limbs.",
            higherLevels: ""
        },
        {
            name: "Geas",
            level: 5,
            school: "Enchantment",
            castingTime: "1 minute",
            range: "60 feet",
            components: "V",
            duration: "30 days",
            description: "You place a magical command on a creature that you can see within range, forcing it to carry out some service or refrain from some action or course of activity as you decide. If the creature can understand you, it must succeed on a Wisdom saving throw or become charmed by you for the duration. While the creature is charmed by you, it takes 5d10 psychic damage each time it acts in a manner directly counter to your instructions, but no more than once each day. A creature that can't understand you is unaffected by the spell.",
            higherLevels: "When you cast this spell using a spell slot of 7th or 8th level, the duration is 1 year. When you use a 9th level spell slot, the spell lasts until it is ended by one of the spells mentioned above."
        },
        
        // === FEYSPACE SPELLS (Spelljammer + Feywild Blend) ===
        {
            name: "Prismatic Void",
            level: 6,
            school: "Evocation",
            castingTime: "1 action",
            range: "150 feet",
            components: "V, S, M (a prism filled with stardust worth 500 gp)",
            duration: "Instantaneous",
            description: "You create a swirling vortex of rainbow-colored void energy at a point you can see within range. The vortex is a 20-foot-radius sphere that pulls creatures toward its center. Each creature in the area must make a Strength saving throw. On a failed save, a creature takes 8d8 force damage and is pulled 20 feet toward the center. On a successful save, the creature takes half damage and isn't pulled. Creatures pulled into the center take an additional 4d8 psychic damage as they experience the disorienting blend of Feywild magic and wildspace void. This spell is particularly effective in wildspace, where the void energy resonates with the surrounding emptiness.",
            higherLevels: "When you cast this spell using a spell slot of 7th level or higher, the force damage increases by 1d8 for each slot level above 6th."
        },
        {
            name: "Fey Helm Attunement",
            level: 3,
            school: "Transmutation",
            castingTime: "1 action",
            range: "Touch",
            components: "V, S, M (a spelljamming helm and a fey flower)",
            duration: "8 hours",
            description: "You infuse a spelljamming helm with fey magic, allowing it to draw power from the emotions and dreams of its operator rather than spell slots. For the duration, a creature attuned to the helm can operate it without expending spell slots. Instead, the ship's speed equals 5 × the operator's Charisma modifier (minimum 5) miles per hour. However, the operator must make a DC 12 Wisdom saving throw each hour or gain one level of exhaustion as the fey magic draws upon their life force. The helm shimmers with iridescent colors while this spell is active.",
            higherLevels: "When you cast this spell using a spell slot of 4th level or higher, the duration increases by 4 hours for each slot level above 3rd."
        },
        {
            name: "Starlight Glamour",
            level: 2,
            school: "Illusion",
            castingTime: "1 action",
            range: "Self",
            components: "V, S, M (a piece of meteorite)",
            duration: "1 hour",
            description: "You cloak yourself in an illusion woven from starlight and fey magic. For the duration, you appear to be made of living starlight, and you shed bright light in a 10-foot radius and dim light for an additional 10 feet. You have advantage on Charisma (Performance) and Charisma (Persuasion) checks. Additionally, when a creature within 10 feet of you hits you with an attack, you can use your reaction to cause the attacker to make a Wisdom saving throw. On a failed save, the attacker is blinded until the end of its next turn as the starlight flares brilliantly.",
            higherLevels: "When you cast this spell using a spell slot of 3rd level or higher, you can affect one additional willing creature you touch for each slot level above 2nd."
        },
        {
            name: "Void Blossom",
            level: 4,
            school: "Conjuration",
            castingTime: "1 action",
            range: "60 feet",
            components: "V, S, M (a flower preserved in amber)",
            duration: "Concentration, up to 10 minutes",
            description: "You cause a massive, ethereal flower to bloom in wildspace at a point you can see. The flower is 30 feet in diameter and creates a breathable atmosphere within a 60-foot radius. The air is fresh and scented with a pleasant floral aroma. Additionally, the flower emits bright light in a 60-foot radius and dim light for an additional 60 feet. Creatures within the flower's atmosphere have advantage on saving throws against fear and charm effects. The flower is intangible and doesn't impede movement or attacks.",
            higherLevels: "When you cast this spell using a spell slot of 5th level or higher, the radius of the atmosphere increases by 10 feet for each slot level above 4th."
        },
        {
            name: "Astral Thorn Barrier",
            level: 3,
            school: "Conjuration",
            castingTime: "1 action",
            range: "120 feet",
            components: "V, S, M (a thorn from a plant native to the Feywild)",
            duration: "Concentration, up to 10 minutes",
            description: "You create a wall of shimmering, crystalline thorns that appears at a point you choose within range. The wall is 60 feet long, 10 feet high, and 5 feet thick. The wall provides three-quarters cover and its space is difficult terrain. When a creature enters the wall's space for the first time on a turn or starts its turn there, it must make a Dexterity saving throw. On a failed save, it takes 4d8 piercing damage and is restrained until the start of its next turn. On a successful save, it takes half damage and isn't restrained. The thorns shimmer with astral energy and can exist in the void of wildspace.",
            higherLevels: "When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d8 for each slot level above 3rd."
        },
        {
            name: "Summon Feyspace Sprite",
            level: 2,
            school: "Conjuration",
            castingTime: "1 action",
            range: "60 feet",
            components: "V, S, M (a tiny crystal sphere worth 50 gp)",
            duration: "Concentration, up to 1 hour",
            description: "You summon a feyspace sprite, a tiny fey creature adapted to life in wildspace. The sprite appears in an unoccupied space you can see within range and uses the sprite stat block, but it can survive in the void of space and has a flying speed of 60 feet. The sprite is friendly to you and your companions and obeys your verbal commands. It can scout ahead in wildspace, deliver messages, and provide advantage on one attack roll, ability check, or saving throw of your choice before the spell ends (no action required).",
            higherLevels: "When you cast this spell using a spell slot of 3rd level or higher, you summon one additional sprite for each slot level above 2nd."
        },
        {
            name: "Chromatic Comet",
            level: 5,
            school: "Evocation",
            castingTime: "1 action",
            range: "300 feet",
            components: "V, S, M (a fragment of a comet)",
            duration: "Instantaneous",
            description: "You hurl a comet of pure fey energy infused with wildspace magic at a point you can see within range. The comet explodes in a 40-foot-radius sphere of rainbow-colored energy. Each creature in the area must make a Dexterity saving throw. On a failed save, a creature takes 6d6 force damage and 6d6 radiant damage and is knocked prone. On a successful save, it takes half damage and isn't knocked prone. Additionally, the area becomes filled with glittering motes of light that provide dim light for 1 minute. This spell is particularly devastating when cast in wildspace, where the comet's trajectory is unimpeded.",
            higherLevels: "When you cast this spell using a spell slot of 6th level or higher, either the force damage or the radiant damage (your choice) increases by 1d6 for each slot level above 5th."
        },
        {
            name: "Fey Portal",
            level: 7,
            school: "Conjuration",
            castingTime: "1 minute",
            range: "60 feet",
            components: "V, S, M (a silver mirror worth 5,000 gp)",
            duration: "Concentration, up to 10 minutes",
            description: "You create a shimmering portal to the Feywild at a point you can see within range. The portal is a circular opening 10 feet in diameter. Any creature that enters the portal is instantly transported to a location in the Feywild of your choice (if you've been there before) or to a random location in the Feywild (if you haven't). The portal remains open for the duration, allowing two-way travel. When cast in wildspace, the portal can also connect to fey-touched regions of wildspace, creating shortcuts through the void. The portal shimmers with all the colors of the rainbow and emits a soft, musical hum.",
            higherLevels: "When you cast this spell using a spell slot of 8th level or higher, the duration increases to 1 hour. When you use a 9th level spell slot, the portal remains open for 8 hours."
        },
        {
            name: "Stellar Transformation",
            level: 6,
            school: "Transmutation",
            castingTime: "1 action",
            range: "Self",
            components: "V, S, M (a piece of star metal worth 1,000 gp)",
            duration: "Concentration, up to 10 minutes",
            description: "You transform yourself into a being of living starlight infused with fey magic. For the duration, you gain the following benefits: You have a flying speed of 60 feet and can hover. You shed bright light in a 30-foot radius and dim light for an additional 30 feet. You have resistance to radiant and force damage. You can move through other creatures and objects as if they were difficult terrain, taking 1d10 force damage if you end your turn inside an object. Once per turn, you can teleport up to 30 feet to an unoccupied space you can see as part of your movement. Your appearance becomes that of a humanoid figure made of swirling starlight and fey energy.",
            higherLevels: ""
        },
        {
            name: "Gravity Reversal",
            level: 4,
            school: "Transmutation",
            castingTime: "1 action",
            range: "120 feet",
            components: "V, S, M (a lodestone and a feather)",
            duration: "Concentration, up to 1 minute",
            description: "You reverse gravity in a 50-foot-radius, 100-foot-high cylinder centered on a point within range. All creatures and objects that aren't somehow anchored to the ground in the area fall upward and reach the top of the area when you cast this spell. A creature can make a Dexterity saving throw to grab onto a fixed object it can reach, thus avoiding the fall. If some solid object (such as a ceiling) is encountered in this fall, falling objects and creatures strike it just as they would during a normal downward fall. If an object or creature reaches the top of the area without striking anything, it remains there, oscillating slightly, for the duration. At the end of the duration, affected objects and creatures fall back down. This spell is particularly useful in wildspace for repositioning during ship combat.",
            higherLevels: "When you cast this spell using a spell slot of 5th level or higher, the radius increases by 10 feet for each slot level above 4th."
        },
        
        // === ORIGINAL SPELLJAMMER SPELLS ===
        {
            name: "Air Bubble",
            level: 2,
            school: "Conjuration",
            castingTime: "1 action",
            range: "60 feet",
            components: "S",
            duration: "24 hours",
            description: "You create a spectral globe around the head of a willing creature you can see within range. The globe is filled with fresh air that lasts until the spell ends. If the creature has more than one head, the globe of air appears around only one of its heads (which is all the creature needs to avoid suffocation, assuming that all its heads share the same respiratory system).",
            higherLevels: "When you cast this spell using a spell slot of 3rd level or higher, you can create two additional globes of fresh air for each slot level above 2nd."
        },
        {
            name: "Create Spelljamming Helm",
            level: 5,
            school: "Transmutation",
            castingTime: "1 action",
            range: "Touch",
            components: "V, S, M (a crystal rod worth at least 5,000 gp, which the spell consumes)",
            duration: "Instantaneous",
            description: "Touching a Large or smaller chair that is on a ship, you transform it into a spelljamming helm. The transformation lasts until the helm is destroyed or until you cast this spell again. If a spellcaster sits in the helm, the ship can move through space and air, using the spellcaster's spell slots as fuel. The ship's speed is based on the level of spell slots expended."
        },
        {
            name: "Gravity Sinkhole",
            level: 4,
            school: "Evocation",
            castingTime: "1 action",
            range: "120 feet",
            components: "V, S, M (a black marble)",
            duration: "Instantaneous",
            description: "A 20-foot-radius sphere of crushing force forms at a point you can see within range and tugs at the creatures there. Each creature in the sphere must make a Constitution saving throw. On a failed save, the creature takes 5d10 force damage and is pulled in a straight line toward the center of the sphere, ending in an unoccupied space as close to the center as possible. On a successful save, the creature takes half as much damage and isn't pulled.",
            higherLevels: "When you cast this spell using a spell slot of 5th level or higher, the damage increases by 1d10 for each slot level above 4th."
        },
        {
            name: "Warp Sense",
            level: 2,
            school: "Divination",
            castingTime: "1 action",
            range: "Self",
            components: "V, S",
            duration: "Concentration, up to 1 minute",
            description: "For the duration, you sense the presence of portals, rifts in reality, and other planar anomalies within 1 mile of you. You learn the direction to each anomaly but not its exact location or nature. The spell can penetrate most barriers but is blocked by 1 foot of stone, 1 inch of common metal, or 3 feet of wood or dirt."
        },
        {
            name: "Summon Wildspace Eel",
            level: 3,
            school: "Conjuration",
            castingTime: "1 action",
            range: "90 feet",
            components: "V, S, M (a piece of eel skin)",
            duration: "Concentration, up to 1 hour",
            description: "You summon a wildspace eel that appears in an unoccupied space you can see within range. The eel is friendly to you and your companions and obeys your commands. It uses the statistics of a giant constrictor snake but can survive in the vacuum of space. When the spell ends, the eel disappears.",
            higherLevels: "When you cast this spell using a spell slot of 4th level or higher, you summon one additional eel for each slot level above 3rd."
        },
        {
            name: "Astral Projection",
            level: 9,
            school: "Necromancy",
            castingTime: "1 hour",
            range: "10 feet",
            components: "V, S, M (for each creature you affect with this spell, you must provide one jacinth worth at least 1,000 gp and one ornately carved bar of silver worth at least 100 gp, all of which the spell consumes)",
            duration: "Special",
            description: "You and up to eight willing creatures within range project your astral bodies into the Astral Plane. The material body you leave behind is unconscious and in a state of suspended animation. Your astral body resembles your mortal form in almost every way, replicating your game statistics and possessions. The spell ends for you and your companions when you use your action to dismiss it. If your astral form drops to 0 hit points, the spell ends for you. If your material body drops to 0 hit points, the spell ends for you."
        },
        {
            name: "Telepathic Bond",
            level: 5,
            school: "Divination",
            castingTime: "1 action",
            range: "30 feet",
            components: "V, S, M (pieces of eggshell from two different kinds of creatures)",
            duration: "1 hour",
            description: "You forge a telepathic link among up to eight willing creatures of your choice within range, psychically linking each creature to all the others for the duration. Creatures with Intelligence scores of 2 or less aren't affected by this spell. Until the spell ends, the targets can communicate telepathically through the bond whether or not they have a common language. The communication is possible over any distance, though it can't extend to other planes of existence."
        },
        {
            name: "Feather Fall",
            level: 1,
            school: "Transmutation",
            castingTime: "1 reaction, which you take when you or a creature within 60 feet of you falls",
            range: "60 feet",
            components: "V, M (a small feather or piece of down)",
            duration: "1 minute",
            description: "Choose up to five falling creatures within range. A falling creature's rate of descent slows to 60 feet per round until the spell ends. If the creature lands before the spell ends, it takes no falling damage and can land on its feet, and the spell ends for that creature."
        },
        {
            name: "Dimension Door",
            level: 4,
            school: "Conjuration",
            castingTime: "1 action",
            range: "500 feet",
            components: "V",
            duration: "Instantaneous",
            description: "You teleport yourself from your current location to any other spot within range. You arrive at exactly the spot desired. It can be a place you can see, one you can visualize, or one you can describe by stating distance and direction. You can bring along objects as long as their weight doesn't exceed what you can carry. You can also bring one willing creature of your size or smaller who is carrying gear up to its carrying capacity."
        },
        {
            name: "Haste",
            level: 3,
            school: "Transmutation",
            castingTime: "1 action",
            range: "30 feet",
            components: "V, S, M (a shaving of licorice root)",
            duration: "Concentration, up to 1 minute",
            description: "Choose a willing creature that you can see within range. Until the spell ends, the target's speed is doubled, it gains a +2 bonus to AC, it has advantage on Dexterity saving throws, and it gains an additional action on each of its turns. That action can be used only to take the Attack (one weapon attack only), Dash, Disengage, Hide, or Use an Object action. When the spell ends, the target can't move or take actions until after its next turn, as a wave of lethargy sweeps over it."
        },
        {
            name: "Magic Missile",
            level: 1,
            school: "Evocation",
            castingTime: "1 action",
            range: "120 feet",
            components: "V, S",
            duration: "Instantaneous",
            description: "You create three glowing darts of magical force. Each dart hits a creature of your choice that you can see within range. A dart deals 1d4 + 1 force damage to its target. The darts all strike simultaneously.",
            higherLevels: "When you cast this spell using a spell slot of 2nd level or higher, the spell creates one more dart for each slot level above 1st."
        },
        {
            name: "Cure Wounds",
            level: 1,
            school: "Evocation",
            castingTime: "1 action",
            range: "Touch",
            components: "V, S",
            duration: "Instantaneous",
            description: "A creature you touch regains a number of hit points equal to 1d8 + your spellcasting ability modifier.",
            higherLevels: "When you cast this spell using a spell slot of 2nd level or higher, the healing increases by 1d8 for each slot level above 1st."
        },
        {
            name: "Shield",
            level: 1,
            school: "Abjuration",
            castingTime: "1 reaction",
            range: "Self",
            components: "V, S",
            duration: "1 round",
            description: "An invisible barrier of magical force appears and protects you. Until the start of your next turn, you have a +5 bonus to AC, including against the triggering attack."
        },
        {
            name: "Fireball",
            level: 3,
            school: "Evocation",
            castingTime: "1 action",
            range: "150 feet",
            components: "V, S, M (a tiny ball of bat guano and sulfur)",
            duration: "Instantaneous",
            description: "A bright streak flashes from your pointing finger to a point you choose within range and then blossoms with a low roar into an explosion of flame. Each creature in a 20-foot-radius sphere centered on that point must make a Dexterity saving throw. A target takes 8d6 fire damage on a failed save, or half as much damage on a successful one.",
            higherLevels: "When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d6 for each slot level above 3rd."
        },
        {
            name: "Healing Word",
            level: 1,
            school: "Evocation",
            castingTime: "1 bonus action",
            range: "60 feet",
            components: "V",
            duration: "Instantaneous",
            description: "A creature of your choice that you can see within range regains hit points equal to 1d4 + your spellcasting ability modifier.",
            higherLevels: "When you cast this spell using a spell slot of 2nd level or higher, the healing increases by 1d4 for each slot level above 1st."
        },
        {
            name: "Counterspell",
            level: 3,
            school: "Abjuration",
            castingTime: "1 reaction",
            range: "60 feet",
            components: "S",
            duration: "Instantaneous",
            description: "You attempt to interrupt a creature in the process of casting a spell. If the creature is casting a spell of 3rd level or lower, its spell fails and has no effect. If it is casting a spell of 4th level or higher, make an ability check using your spellcasting ability. The DC equals 10 + the spell's level. On a success, the creature's spell fails."
        },
        {
            name: "Eldritch Blast",
            level: 0,
            school: "Evocation",
            castingTime: "1 action",
            range: "120 feet",
            components: "V, S",
            duration: "Instantaneous",
            description: "A beam of crackling energy streaks toward a creature within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 force damage.",
            higherLevels: "The spell creates more than one beam when you reach higher levels: two beams at 5th level, three beams at 11th level, and four beams at 17th level."
        },
        {
            name: "Bless",
            level: 1,
            school: "Enchantment",
            castingTime: "1 action",
            range: "30 feet",
            components: "V, S, M (a sprinkling of holy water)",
            duration: "Concentration, up to 1 minute",
            description: "You bless up to three creatures of your choice within range. Whenever a target makes an attack roll or a saving throw before the spell ends, the target can roll a d4 and add the number rolled to the attack roll or saving throw."
        }
    ],
    items: [
        {
            name: "Longsword",
            type: "Weapon (martial, melee)",
            rarity: "Common",
            cost: "15 gp",
            weight: "3 lbs",
            properties: "Versatile (1d10)",
            description: "A standard longsword. Deals 1d8 slashing damage (or 1d10 if wielded with two hands)."
        },
        {
            name: "Potion of Healing",
            type: "Potion",
            rarity: "Common",
            cost: "50 gp",
            weight: "0.5 lbs",
            description: "You regain 2d4 + 2 hit points when you drink this potion. Drinking or administering a potion takes an action."
        },
        {
            name: "Bag of Holding",
            type: "Wondrous item",
            rarity: "Uncommon",
            cost: "500 gp",
            weight: "15 lbs",
            description: "This bag has an interior space considerably larger than its outside dimensions. The bag can hold up to 500 pounds, not exceeding a volume of 64 cubic feet. Retrieving an item from the bag requires an action."
        },
        {
            name: "Rope of Climbing",
            type: "Wondrous item",
            rarity: "Uncommon",
            cost: "2,000 gp",
            weight: "3 lbs",
            description: "This 60-foot length of silk rope can be commanded to move and fasten itself. It can unfasten itself and return to you as a bonus action."
        },
        {
            name: "+1 Weapon",
            type: "Weapon (any)",
            rarity: "Uncommon",
            cost: "Varies",
            weight: "Varies",
            description: "You have a +1 bonus to attack and damage rolls made with this magic weapon."
        },
        {
            name: "Cloak of Protection",
            type: "Wondrous item",
            rarity: "Uncommon",
            cost: "3,500 gp",
            attunement: "Requires attunement",
            description: "You gain a +1 bonus to AC and saving throws while you wear this cloak."
        },
        {
            name: "Ring of Spell Storing",
            type: "Ring",
            rarity: "Rare",
            cost: "10,000 gp",
            attunement: "Requires attunement",
            description: "This ring stores spells cast into it, holding them until the attuned wearer uses them. The ring can store up to 5 levels worth of spells at a time."
        },
        {
            name: "Immovable Rod",
            type: "Rod",
            rarity: "Uncommon",
            cost: "5,000 gp",
            weight: "2 lbs",
            description: "This flat iron rod has a button on one end. You can use an action to press the button, which causes the rod to become magically fixed in place. Until you or another creature uses an action to push the button again, the rod doesn't move, even if it is defying gravity."
        },
        {
            name: "Spelljamming Helm",
            type: "Wondrous item",
            rarity: "Rare",
            cost: "50,000 gp",
            weight: "50 lbs",
            attunement: "Requires attunement by a spellcaster",
            description: "This ornate chair allows a spellcaster to propel and steer a spelljamming ship through space. While attuned and sitting in the helm, you can use your spell slots to move the ship. The ship's speed equals your spellcasting ability modifier × 10 miles per hour in space. You can't cast spells or concentrate on spells while operating the helm."
        },
        {
            name: "Wildspace Orrery",
            type: "Wondrous item",
            rarity: "Very Rare",
            cost: "25,000 gp",
            weight: "10 lbs",
            description: "This intricate mechanical model of a crystal sphere shows the positions of celestial bodies. As an action, you can consult the orrery to learn the direction and approximate distance to any known celestial body within the current crystal sphere. The orrery also grants advantage on Intelligence (Arcana) checks related to navigation in wildspace."
        },
        {
            name: "Boots of the Winterlands",
            type: "Wondrous item",
            rarity: "Uncommon",
            cost: "5,000 gp",
            attunement: "Requires attunement",
            description: "These furred boots are snug and feel quite warm. While you wear them, you gain the following benefits: You have resistance to cold damage. You ignore difficult terrain created by ice or snow. You can tolerate temperatures as low as −50 degrees Fahrenheit without any additional protection."
        },
        {
            name: "Necklace of Adaptation",
            type: "Wondrous item",
            rarity: "Uncommon",
            cost: "1,500 gp",
            attunement: "Requires attunement",
            description: "While wearing this necklace, you can breathe normally in any environment, and you have advantage on saving throws made against harmful gases and vapors (such as cloudkill and stinking cloud effects, inhaled poisons, and the breath weapons of some dragons)."
        },
        {
            name: "Sending Stones",
            type: "Wondrous item",
            rarity: "Uncommon",
            cost: "2,000 gp",
            weight: "0.5 lbs",
            description: "Sending stones come in pairs, with each smooth stone carved to match the other so the pairing is easily recognized. While you touch one stone, you can use an action to cast the sending spell from it. The target is the bearer of the other stone. If no creature bears the other stone, you know that fact as soon as you use the stone and don't cast the spell. Once sending is cast through the stones, they can't be used again until the next dawn."
        },
        {
            name: "Helm of Telepathy",
            type: "Wondrous item",
            rarity: "Uncommon",
            cost: "8,000 gp",
            attunement: "Requires attunement",
            description: "While wearing this helm, you can use an action to cast the detect thoughts spell (save DC 13) from it. As long as you maintain concentration on the spell, you can use a bonus action to send a telepathic message to a creature you are focused on. It can reply-using a bonus action to do so-while your focus on it continues. Once used, the helm can't cast detect thoughts again until the next dawn."
        },
        {
            name: "Decanter of Endless Water",
            type: "Wondrous item",
            rarity: "Uncommon",
            cost: "5,000 gp",
            weight: "2 lbs",
            description: "This stoppered flask sloshes when shaken, as if it contains water. The decanter weighs 2 pounds. You can use an action to remove the stopper and speak one of three command words, whereupon an amount of fresh water or salt water (your choice) pours out of the flask. The water stops pouring out at the start of your next turn. Choose from the following options: 'Stream' produces 1 gallon of water. 'Fountain' produces 5 gallons of water. 'Geyser' produces 30 gallons of water that gushes forth in a geyser 30 feet long and 1 foot wide."
        },
        {
            name: "Alchemy Jug",
            type: "Wondrous item",
            rarity: "Uncommon",
            cost: "6,000 gp",
            weight: "12 lbs",
            description: "This ceramic jug appears to be able to hold a gallon of liquid and weighs 12 pounds whether full or empty. Sloshing sounds can be heard from within the jug when it is shaken, even if the jug is empty. You can use an action and name one liquid from the table below to cause the jug to produce the chosen liquid. Afterward, you can uncork the jug as an action and pour that liquid out, up to 2 gallons per minute. The maximum amount of liquid the jug can produce depends on the liquid you named."
        },
        {
            name: "Eversmoking Bottle",
            type: "Wondrous item",
            rarity: "Uncommon",
            cost: "1,000 gp",
            weight: "1 lb",
            description: "Smoke leaks from the lead-stoppered mouth of this brass bottle, which weighs 1 pound. When you use an action to remove the stopper, a cloud of thick smoke pours out in a 60-foot radius from the bottle. The cloud's area is heavily obscured. Each minute the bottle remains open and within the cloud, the radius increases by 10 feet until it reaches its maximum radius of 120 feet. The cloud persists as long as the bottle is open. Closing the bottle requires you to speak its command word as an action."
        },
        {
            name: "Portable Hole",
            type: "Wondrous item",
            rarity: "Rare",
            cost: "8,000 gp",
            weight: "0 lbs",
            description: "This fine black cloth, soft as silk, is folded up to the dimensions of a handkerchief. It unfolds into a circular sheet 6 feet in diameter. You can use an action to unfold a portable hole and place it on or against a solid surface, whereupon the portable hole creates an extradimensional hole 10 feet deep. The cylindrical space within the hole exists on a different plane, so it can't be used to create open passages."
        },
        {
            name: "Figurine of Wondrous Power (Silver Raven)",
            type: "Wondrous item",
            rarity: "Uncommon",
            cost: "5,000 gp",
            weight: "0.5 lbs",
            description: "This silver statuette of a raven can become a raven for up to 12 hours. Once it has been used, it can't be used again until 2 days have passed. While in raven form, the figurine allows you to cast the animal messenger spell on it at will."
        }
    ],
    monsters: [
        {
            name: "Goblin",
            type: "Small humanoid (goblinoid)",
            cr: "1/4",
            ac: 15,
            hp: "7 (2d6)",
            speed: "30 ft",
            stats: { str: 8, dex: 14, con: 10, int: 10, wis: 8, cha: 8 },
            skills: "Stealth +6",
            senses: "Darkvision 60 ft., Passive Perception 9",
            languages: "Common, Goblin",
            traits: [
                { name: "Nimble Escape", description: "The goblin can take the Disengage or Hide action as a bonus action on each of its turns." }
            ],
            actions: [
                { name: "Scimitar", description: "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) slashing damage." },
                { name: "Shortbow", description: "Ranged Weapon Attack: +4 to hit, range 80/320 ft., one target. Hit: 5 (1d6 + 2) piercing damage." }
            ]
        },
        {
            name: "Orc",
            type: "Medium humanoid (orc)",
            cr: "1/2",
            ac: 13,
            hp: "15 (2d8 + 6)",
            speed: "30 ft",
            stats: { str: 16, dex: 12, con: 16, int: 7, wis: 11, cha: 10 },
            skills: "Intimidation +2",
            senses: "Darkvision 60 ft., Passive Perception 10",
            languages: "Common, Orc",
            traits: [
                { name: "Aggressive", description: "As a bonus action, the orc can move up to its speed toward a hostile creature that it can see." }
            ],
            actions: [
                { name: "Greataxe", description: "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 9 (1d12 + 3) slashing damage." },
                { name: "Javelin", description: "Melee or Ranged Weapon Attack: +5 to hit, reach 5 ft. or range 30/120 ft., one target. Hit: 6 (1d6 + 3) piercing damage." }
            ]
        },
        {
            name: "Young Red Dragon",
            type: "Large dragon",
            cr: "10",
            ac: 18,
            hp: "178 (17d10 + 85)",
            speed: "40 ft., climb 40 ft., fly 80 ft.",
            stats: { str: 23, dex: 10, con: 21, int: 14, wis: 11, cha: 19 },
            saves: "Dex +4, Con +9, Wis +4, Cha +8",
            skills: "Perception +8, Stealth +4",
            immunities: "Fire",
            senses: "Blindsight 30 ft., Darkvision 120 ft., Passive Perception 18",
            languages: "Common, Draconic",
            traits: [],
            actions: [
                { name: "Multiattack", description: "The dragon makes three attacks: one with its bite and two with its claws." },
                { name: "Bite", description: "Melee Weapon Attack: +10 to hit, reach 10 ft., one target. Hit: 17 (2d10 + 6) piercing damage plus 3 (1d6) fire damage." },
                { name: "Claw", description: "Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 13 (2d6 + 6) slashing damage." },
                { name: "Fire Breath (Recharge 5-6)", description: "The dragon exhales fire in a 30-foot cone. Each creature in that area must make a DC 17 Dexterity saving throw, taking 56 (16d6) fire damage on a failed save, or half as much damage on a successful one." }
            ]
        },
        {
            name: "Gelatinous Cube",
            type: "Large ooze",
            cr: "2",
            ac: 6,
            hp: "84 (8d10 + 40)",
            speed: "15 ft",
            stats: { str: 14, dex: 3, con: 20, int: 1, wis: 6, cha: 1 },
            immunities: "Acid, cold, lightning; blinded, charmed, deafened, exhaustion, frightened, prone",
            senses: "Blindsight 60 ft. (blind beyond this radius), Passive Perception 8",
            languages: "-",
            traits: [
                { name: "Ooze Cube", description: "The cube takes up its entire space. Other creatures can enter the space, but a creature that does so is subjected to the cube's Engulf and has disadvantage on the saving throw." },
                { name: "Transparent", description: "Even when the cube is in plain sight, it takes a successful DC 15 Wisdom (Perception) check to spot a cube that has neither moved nor attacked." }
            ],
            actions: [
                { name: "Pseudopod", description: "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 10 (3d6) acid damage." },
                { name: "Engulf", description: "The cube moves up to its speed. While doing so, it can enter Large or smaller creatures' spaces. Whenever the cube enters a creature's space, the creature must make a DC 12 Dexterity saving throw." }
            ]
        },
        {
            name: "Beholder",
            type: "Large aberration",
            cr: "13",
            ac: 18,
            hp: "180 (19d10 + 76)",
            speed: "0 ft., fly 20 ft. (hover)",
            stats: { str: 10, dex: 14, con: 18, int: 17, wis: 15, cha: 17 },
            saves: "Int +8, Wis +7, Cha +8",
            skills: "Perception +12",
            immunities: "Prone",
            senses: "Darkvision 120 ft., Passive Perception 22",
            languages: "Deep Speech, Undercommon",
            traits: [
                { name: "Antimagic Cone", description: "The beholder's central eye creates an area of antimagic, as in the antimagic field spell, in a 150-foot cone." }
            ],
            actions: [
                { name: "Bite", description: "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 14 (4d6) piercing damage." },
                { name: "Eye Rays", description: "The beholder shoots three of the following magical eye rays at random (reroll duplicates), choosing one to three targets it can see within 120 feet of it: Charm Ray, Paralyzing Ray, Fear Ray, Slowing Ray, Enervation Ray, Telekinetic Ray, Sleep Ray, Petrification Ray, Disintegration Ray, Death Ray." }
            ]
        },
        {
            name: "Astral Dreadnought",
            type: "Gargantuan monstrosity (titan)",
            cr: "21",
            ac: 20,
            hp: "297 (17d20 + 119)",
            speed: "15 ft., fly 80 ft. (hover)",
            stats: { str: 28, dex: 7, con: 25, int: 5, wis: 14, cha: 18 },
            saves: "Dex +5, Wis +9",
            skills: "Perception +9",
            immunities: "Charmed, exhaustion, frightened, paralyzed, petrified, poisoned, prone, stunned",
            senses: "Darkvision 120 ft., Passive Perception 19",
            languages: "-",
            traits: [
                { name: "Antimagic Cone", description: "The dreadnought's opened eye creates an area of antimagic, as in the antimagic field spell, in a 150-foot cone. At the start of each of its turns, it decides which way the cone faces." },
                { name: "Astral Entity", description: "The dreadnought can't leave the Astral Plane, nor can it be banished or otherwise transported out of that plane." },
                { name: "Demiplanar Donjon", description: "Anything the dreadnought swallows is transported to a demiplane that can be entered by no other means except a wish spell. A creature can leave the demiplane only by using magic that enables planar travel." }
            ],
            actions: [
                { name: "Multiattack", description: "The dreadnought makes three attacks: one with its bite and two with its claws." },
                { name: "Bite", description: "Melee Weapon Attack: +16 to hit, reach 10 ft., one target. Hit: 36 (5d10 + 9) force damage. If the target is a Huge or smaller creature and this damage reduces it to 0 hit points or it is incapacitated, the dreadnought swallows it." },
                { name: "Claw", description: "Melee Weapon Attack: +16 to hit, reach 20 ft., one target. Hit: 19 (3d6 + 9) force damage." }
            ]
        },
        {
            name: "Neogi Master",
            type: "Small aberration",
            cr: "4",
            ac: 15,
            hp: "71 (13d6 + 26)",
            speed: "30 ft., climb 30 ft.",
            stats: { str: 6, dex: 16, con: 14, int: 16, wis: 12, cha: 18 },
            saves: "Wis +3",
            skills: "Arcana +5, Deception +6, Intimidation +6, Perception +3, Persuasion +6",
            senses: "Darkvision 60 ft., Passive Perception 13",
            languages: "Common, Deep Speech, Undercommon, telepathy 30 ft.",
            traits: [
                { name: "Mental Fortitude", description: "The neogi has advantage on saving throws against being charmed or frightened, and magic can't put it to sleep." },
                { name: "Spider Climb", description: "The neogi can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check." }
            ],
            actions: [
                { name: "Multiattack", description: "The neogi makes two attacks: one with its bite and one with its claws." },
                { name: "Bite", description: "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) piercing damage plus 14 (4d6) poison damage, and the target must succeed on a DC 12 Constitution saving throw or become poisoned for 1 minute." },
                { name: "Claws", description: "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 8 (2d4 + 3) slashing damage." },
                { name: "Enslave (Recharge 6)", description: "The neogi targets one creature it can see within 30 feet of it. The target must succeed on a DC 14 Wisdom saving throw or be magically charmed by the neogi for 1 day, or until the neogi dies or is more than 1 mile from the target." }
            ]
        },
        {
            name: "Giff",
            type: "Medium humanoid",
            cr: "3",
            ac: 16,
            hp: "60 (8d8 + 24)",
            speed: "30 ft.",
            stats: { str: 18, dex: 14, con: 17, int: 11, wis: 12, cha: 12 },
            senses: "Passive Perception 11",
            languages: "Common",
            traits: [
                { name: "Firearms Knowledge", description: "The giff's mastery of its weapons enables it to ignore the loading property of muskets and pistols." },
                { name: "Headfirst Charge", description: "The giff can try to knock a creature over; if the giff moves at least 20 feet in a straight line and ends within 5 feet of a Large or smaller creature, that creature must succeed on a DC 14 Strength saving throw or take 7 (2d6) bludgeoning damage and be knocked prone." }
            ],
            actions: [
                { name: "Multiattack", description: "The giff makes two pistol attacks." },
                { name: "Longsword", description: "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 8 (1d8 + 4) slashing damage, or 9 (1d10 + 4) slashing damage if used with two hands." },
                { name: "Musket", description: "Ranged Weapon Attack: +4 to hit, range 40/120 ft., one target. Hit: 8 (1d12 + 2) piercing damage." },
                { name: "Fragmentation Grenade (1/Day)", description: "The giff throws a grenade up to 60 feet. Each creature within 20 feet of the grenade's detonation must make a DC 15 Dexterity saving throw, taking 17 (5d6) piercing damage on a failed save, or half as much damage on a successful one." }
            ]
        },
        {
            name: "Plasmoid",
            type: "Medium ooze",
            cr: "1/2",
            ac: 12,
            hp: "32 (5d8 + 10)",
            speed: "30 ft.",
            stats: { str: 10, dex: 15, con: 14, int: 10, wis: 12, cha: 10 },
            skills: "Stealth +4",
            immunities: "Acid, poison; poisoned",
            senses: "Darkvision 60 ft., Passive Perception 11",
            languages: "Common",
            traits: [
                { name: "Amorphous", description: "The plasmoid can move through a space as narrow as 1 inch wide without squeezing." },
                { name: "Hold Breath", description: "The plasmoid can hold its breath for 1 hour." },
                { name: "Shape Self", description: "As a bonus action, the plasmoid can reshape its body to give itself a head, one or two arms, one or two legs, all of these, or none of these." }
            ],
            actions: [
                { name: "Pseudopod", description: "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 6 (1d8 + 2) bludgeoning damage plus 3 (1d6) acid damage." }
            ]
        },
        {
            name: "Hadozee Explorer",
            type: "Medium humanoid",
            cr: "1",
            ac: 13,
            hp: "22 (4d8 + 4)",
            speed: "30 ft., climb 30 ft.",
            stats: { str: 12, dex: 16, con: 12, int: 10, wis: 14, cha: 10 },
            skills: "Acrobatics +5, Athletics +3, Perception +4, Survival +4",
            senses: "Passive Perception 14",
            languages: "Common",
            traits: [
                { name: "Glide", description: "When the hadozee falls at least 10 feet, it can use its reaction to extend its skin membranes to glide horizontally a number of feet equal to twice the number of feet it fell, taking no falling damage." }
            ],
            actions: [
                { name: "Multiattack", description: "The hadozee makes two attacks with its dagger or shortbow." },
                { name: "Dagger", description: "Melee or Ranged Weapon Attack: +5 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 5 (1d4 + 3) piercing damage." },
                { name: "Shortbow", description: "Ranged Weapon Attack: +5 to hit, range 80/320 ft., one target. Hit: 6 (1d6 + 3) piercing damage." }
            ]
        },
        {
            name: "Kindori (Space Whale)",
            type: "Gargantuan beast",
            cr: "11",
            ac: 14,
            hp: "189 (14d20 + 42)",
            speed: "0 ft., fly 60 ft. (hover)",
            stats: { str: 22, dex: 10, con: 17, int: 3, wis: 12, cha: 7 },
            senses: "Blindsight 120 ft., Passive Perception 11",
            languages: "-",
            traits: [
                { name: "Echolocation", description: "The kindori can't use its blindsight while deafened." },
                { name: "Hold Breath", description: "The kindori can hold its breath for 1 hour." },
                { name: "Void Dweller", description: "The kindori doesn't require air and can survive in the void of space." }
            ],
            actions: [
                { name: "Bite", description: "Melee Weapon Attack: +10 to hit, reach 10 ft., one target. Hit: 32 (4d12 + 6) piercing damage." },
                { name: "Tail Slap", description: "Melee Weapon Attack: +10 to hit, reach 20 ft., one target. Hit: 28 (4d10 + 6) bludgeoning damage." }
            ]
        },
        {
            name: "Scavver",
            type: "Huge monstrosity",
            cr: "5",
            ac: 13,
            hp: "85 (10d12 + 20)",
            speed: "0 ft., fly 40 ft.",
            stats: { str: 18, dex: 16, con: 15, int: 2, wis: 13, cha: 5 },
            skills: "Perception +4",
            senses: "Darkvision 120 ft., Passive Perception 14",
            languages: "-",
            traits: [
                { name: "Void Dweller", description: "The scavver doesn't require air and can survive in the void of space." }
            ],
            actions: [
                { name: "Multiattack", description: "The scavver makes two attacks: one with its bite and one with its tail." },
                { name: "Bite", description: "Melee Weapon Attack: +7 to hit, reach 10 ft., one target. Hit: 20 (3d10 + 4) piercing damage." },
                { name: "Tail", description: "Melee Weapon Attack: +7 to hit, reach 15 ft., one target. Hit: 13 (2d8 + 4) bludgeoning damage." }
            ]
        },
        {
            name: "Vampirate",
            type: "Medium undead",
            cr: "5",
            ac: 15,
            hp: "82 (11d8 + 33)",
            speed: "30 ft.",
            stats: { str: 16, dex: 16, con: 16, int: 11, wis: 13, cha: 14 },
            saves: "Dex +6, Wis +4",
            skills: "Perception +4, Stealth +6",
            immunities: "Necrotic, poison; poisoned",
            senses: "Darkvision 60 ft., Passive Perception 14",
            languages: "Common",
            traits: [
                { name: "Regeneration", description: "The vampirate regains 10 hit points at the start of its turn if it has at least 1 hit point and isn't in sunlight. If the vampirate takes radiant damage, this trait doesn't function at the start of the vampirate's next turn." },
                { name: "Spider Climb", description: "The vampirate can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check." },
                { name: "Sunlight Hypersensitivity", description: "The vampirate takes 20 radiant damage when it starts its turn in sunlight. While in sunlight, it has disadvantage on attack rolls and ability checks." }
            ],
            actions: [
                { name: "Multiattack", description: "The vampirate makes two attacks, only one of which can be a bite attack." },
                { name: "Bite", description: "Melee Weapon Attack: +6 to hit, reach 5 ft., one willing creature, or a creature that is grappled by the vampirate, incapacitated, or restrained. Hit: 6 (1d6 + 3) piercing damage plus 7 (2d6) necrotic damage. The target's hit point maximum is reduced by an amount equal to the necrotic damage taken." },
                { name: "Scimitar", description: "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) slashing damage." },
                { name: "Pistol", description: "Ranged Weapon Attack: +6 to hit, range 30/90 ft., one target. Hit: 8 (1d10 + 3) piercing damage." }
            ]
        },
        {
            name: "Autognome",
            type: "Small construct",
            cr: "1/2",
            ac: 13,
            hp: "18 (4d6 + 4)",
            speed: "30 ft.",
            stats: { str: 10, dex: 13, con: 12, int: 14, wis: 11, cha: 7 },
            skills: "Arcana +4, Investigation +4",
            immunities: "Poison; poisoned",
            senses: "Darkvision 60 ft., Passive Perception 10",
            languages: "Common plus one language of its creator",
            traits: [
                { name: "Armored Casing", description: "The autognome's AC includes its Dexterity modifier plus its proficiency bonus." },
                { name: "Healing Machine", description: "If the mending spell is cast on the autognome, it regains 2d6 hit points. In addition, the autognome regains hit points from spare parts used with tinker's tools." },
                { name: "Mechanical Nature", description: "The autognome doesn't require air, food, drink, or sleep." }
            ],
            actions: [
                { name: "Slam", description: "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 3 (1d4 + 1) bludgeoning damage." },
                { name: "Fire Bolt (Cantrip)", description: "Ranged Spell Attack: +4 to hit, range 120 ft., one target. Hit: 5 (1d10) fire damage." }
            ]
        }
    ],
    rules: [
        {
            name: "Advantage and Disadvantage",
            category: "Core Mechanics",
            description: "Sometimes a special ability or spell tells you that you have advantage or disadvantage on an ability check, a saving throw, or an attack roll. When that happens, you roll a second d20 when you make the roll. Use the higher of the two rolls if you have advantage, and use the lower roll if you have disadvantage."
        },
        {
            name: "Combat Actions",
            category: "Combat",
            description: "On your turn, you can move a distance up to your speed and take one action. Common actions include:\n\n• Attack: Make one melee or ranged attack\n• Cast a Spell: Cast a spell with a casting time of 1 action\n• Dash: Gain extra movement equal to your speed\n• Disengage: Your movement doesn't provoke opportunity attacks\n• Dodge: Attack rolls against you have disadvantage\n• Help: Give an ally advantage on their next ability check or attack\n• Hide: Make a Dexterity (Stealth) check\n• Ready: Prepare an action to trigger on a condition\n• Search: Make a Wisdom (Perception) or Intelligence (Investigation) check\n• Use an Object: Interact with an object"
        },
        {
            name: "Bonus Actions",
            category: "Combat",
            description: "Various class features, spells, and other abilities let you take an additional action on your turn called a bonus action. You can take a bonus action only when a special ability, spell, or feature states that you can do something as a bonus action. You can take only one bonus action on your turn."
        },
        {
            name: "Reactions",
            category: "Combat",
            description: "Certain special abilities, spells, and situations allow you to take a special action called a reaction. A reaction is an instant response to a trigger of some kind, which can occur on your turn or on someone else's. The most common reaction is the opportunity attack."
        },
        {
            name: "Opportunity Attacks",
            category: "Combat",
            description: "You can make an opportunity attack when a hostile creature that you can see moves out of your reach. To make the opportunity attack, you use your reaction to make one melee attack against the provoking creature. The attack occurs right before the creature leaves your reach."
        },
        {
            name: "Cover",
            category: "Combat",
            description: "Walls, trees, creatures, and other obstacles can provide cover during combat, making a target more difficult to harm.\n\n• Half Cover: +2 bonus to AC and Dexterity saving throws\n• Three-Quarters Cover: +5 bonus to AC and Dexterity saving throws\n• Total Cover: Can't be targeted directly by an attack or spell"
        },
        {
            name: "Conditions",
            category: "Combat",
            description: "Conditions alter a creature's capabilities in a variety of ways:\n\n• Blinded: Can't see, fails ability checks requiring sight, attack rolls have disadvantage, attacks against have advantage\n• Charmed: Can't attack the charmer, charmer has advantage on social checks\n• Frightened: Disadvantage on ability checks and attacks while source is in sight, can't willingly move closer\n• Grappled: Speed becomes 0, can't benefit from bonuses to speed\n• Paralyzed: Incapacitated, can't move or speak, fails Strength and Dexterity saves, attacks have advantage, hits are critical\n• Poisoned: Disadvantage on attack rolls and ability checks\n• Prone: Disadvantage on attack rolls, attacks within 5 ft have advantage, attacks beyond 5 ft have disadvantage\n• Restrained: Speed becomes 0, attacks have disadvantage, attacks against have advantage, disadvantage on Dexterity saves\n• Stunned: Incapacitated, can't move, can speak only falteringly, fails Strength and Dexterity saves, attacks have advantage\n• Unconscious: Incapacitated, can't move or speak, unaware of surroundings, drops what it's holding and falls prone, fails Strength and Dexterity saves, attacks have advantage, hits within 5 ft are critical"
        },
        {
            name: "Resting",
            category: "Adventuring",
            description: "Short Rest: A period of downtime, at least 1 hour long, during which you do nothing more strenuous than eating, drinking, reading, and tending to wounds. You can spend Hit Dice to regain hit points.\n\nLong Rest: A period of extended downtime, at least 8 hours long, during which you sleep or perform light activity. At the end, you regain all lost hit points and spent Hit Dice up to half your maximum."
        },
        {
            name: "Death Saving Throws",
            category: "Combat",
            description: "When you drop to 0 hit points, you either die outright or fall unconscious. If damage reduces you to 0 hit points and fails to kill you, you fall unconscious and begin making death saving throws.\n\nRoll a d20. On a 10 or higher, you succeed. On a 9 or lower, you fail. On your third success, you become stable. On your third failure, you die. Rolling a 1 counts as two failures. Rolling a 20 restores 1 hit point."
        },
        {
            name: "Concentration",
            category: "Spellcasting",
            description: "Some spells require you to maintain concentration to keep their magic active. If you lose concentration, the spell ends.\n\nYou lose concentration if:\n• You cast another concentration spell\n• You take damage (make a Constitution save, DC 10 or half damage taken, whichever is higher)\n• You're incapacitated or killed\n• You're in an environment that prevents concentration"
        },
        {
            name: "Spell Slots",
            category: "Spellcasting",
            description: "Spell slots are the resource you expend to cast spells. When you cast a spell, you expend a slot of the spell's level or higher. You regain all expended spell slots when you finish a long rest.\n\nCasting a spell at a higher level can increase its power, as described in the spell's description."
        },
        {
            name: "Ability Checks",
            category: "Core Mechanics",
            description: "An ability check tests a character's or monster's innate talent and training in an effort to overcome a challenge. The DM calls for an ability check when a character or monster attempts an action (other than an attack) that has a chance of failure.\n\nTo make an ability check, roll a d20 and add the relevant ability modifier. Apply bonuses and penalties, and compare the total to the DC. If the total equals or exceeds the DC, the check succeeds."
        },
        {
            name: "Spelljamming",
            category: "Wildspace Travel",
            description: "Spelljamming allows ships to travel through wildspace and the Astral Sea. A spelljamming helm requires attunement by a spellcaster, who can use spell slots to propel the ship.\n\n• Speed: The ship's spelljamming speed equals the helms man's spellcasting ability modifier × 10 miles per hour\n• Air Envelope: Each ship has an air envelope that provides breathable air for 120 days per ton of ship weight\n• Gravity Plane: Ships generate their own gravity, with 'down' being toward the ship's keel\n• Helm Exhaustion: Operating a helm is mentally taxing; the helmsman cannot cast spells or concentrate on spells while at the helm"
        },
        {
            name: "Wildspace Combat",
            category: "Wildspace Travel",
            description: "Ship-to-ship combat in wildspace follows special rules:\n\n• Initiative: Ships roll initiative using the helmsman's Dexterity modifier\n• Movement: Ships can move their spelljamming speed and turn up to 90 degrees per round\n• Weapons: Ships can be equipped with ballistae, mangonels, and other siege weapons\n• Boarding: Ships within 10 feet can be boarded; boarding actions use normal combat rules\n• Ramming: A ship can attempt to ram another ship, dealing damage based on size and speed\n• Crew Actions: Crew members can take the Help action to assist with ship operations"
        },
        {
            name: "Air Envelopes",
            category: "Wildspace Travel",
            description: "Every object in wildspace is surrounded by an air envelope that provides breathable air:\n\n• Size: An air envelope extends 10 feet beyond the object in all directions per ton of weight\n• Duration: Air remains fresh for 120 days per ton of ship weight divided by the number of breathing creatures\n• Fouling: When air becomes stale, creatures must succeed on a DC 10 Constitution saving throw each hour or gain one level of exhaustion\n• Merging: When two air envelopes overlap, they merge and equalize in quality\n• Replenishment: Fresh air can be obtained from planets, asteroids with atmospheres, or magical means"
        },
        {
            name: "Gravity in Wildspace",
            category: "Wildspace Travel",
            description: "Gravity works differently in wildspace:\n\n• Ship Gravity: Each ship generates a gravity plane parallel to its deck. 'Down' is toward the keel\n• Object Gravity: Objects over 1 ton generate their own gravity field\n• Gravity Wells: Large celestial bodies create gravity wells that can pull ships off course\n• Falling: Creatures that fall off a ship continue moving in the same direction at the same speed until they encounter another gravity field\n• Orientation: When entering a new gravity field, creatures can choose their orientation"
        },
        {
            name: "Crystal Spheres",
            category: "Wildspace Travel",
            description: "Crystal spheres are gigantic shells that enclose entire solar systems:\n\n• Composition: Crystal spheres are made of an impenetrable material that blocks all magic and physical passage\n• Portals: The only way to enter or exit a crystal sphere is through naturally occurring portals\n• Phlogiston: The space between crystal spheres is filled with the phlogiston, a highly flammable rainbow-colored gas\n• No Magic: Spelljamming helms don't function in the phlogiston; ships must use conventional sails\n• Fire Danger: Any open flame in the phlogiston causes a catastrophic explosion"
        },
        {
            name: "Astral Travel",
            category: "Planar Travel",
            description: "The Astral Plane is a realm of thought and dream:\n\n• Timelessness: Creatures don't age, hunger, or thirst in the Astral Plane\n• Psychic Navigation: Travel is accomplished by thought; think of a destination and move toward it\n• Astral Projection: Creatures can project their consciousness into the Astral Plane, leaving their bodies behind\n• Color Pools: Portals to other planes appear as colored pools of light\n• Githyanki: The Astral Plane is home to the githyanki, who sail astral ships and raid other planes\n• Psychic Wind: Occasional psychic storms can blow travelers off course or damage their minds"
        },
        {
            name: "Ship Roles",
            category: "Wildspace Travel",
            description: "Crew members can take on specific roles during ship operations:\n\n• Helmsman: Operates the spelljamming helm, controlling movement and speed\n• Captain: Issues orders and makes tactical decisions; can grant advantage to crew checks\n• Bosun: Manages the crew and ship maintenance; can repair damage during combat\n• Gunner: Operates ship weapons; makes attack rolls with siege weapons\n• Lookout: Watches for threats and opportunities; makes Perception checks to spot dangers\n• Surgeon: Tends to wounded crew; can stabilize dying creatures and provide healing"
        },
        {
            name: "Ship Damage",
            category: "Wildspace Travel",
            description: "Ships can take damage and be destroyed:\n\n• Hull Points: Ships have hull points based on their size and construction\n• Critical Hits: When a ship is reduced to half hull points, roll on the critical damage table\n• Repairs: Ships can be repaired using carpenter's tools and appropriate materials\n• Sinking: A ship reduced to 0 hull points begins to break apart and becomes unusable\n• Crew Casualties: When a ship takes damage, crew members may be injured or killed\n• Salvage: Destroyed ships can be salvaged for parts and treasure"
        },
        {
            name: "Wildspace Hazards",
            category: "Wildspace Travel",
            description: "Wildspace contains many dangers:\n\n• Asteroid Fields: Dense clusters of rocks that can damage ships; require Navigation checks to traverse safely\n• Debris Fields: Remnants of destroyed ships and stations; may contain salvage but also dangers\n• Radiation: Some celestial bodies emit harmful radiation; creatures must make Constitution saves or take damage\n• Extreme Temperatures: Near stars or in deep space, temperature extremes can be deadly\n• Void Predators: Creatures like scavvers and kindori hunt in wildspace\n• Pirate Ambushes: Spelljammer pirates often lurk near trade routes and portals"
        },
        {
            name: "Planar Portals",
            category: "Planar Travel",
            description: "Portals connect different planes of existence:\n\n• Types: Portals can be permanent, temporary, or one-way\n• Keys: Some portals require specific items, words, or conditions to activate\n• Identification: A successful Arcana check can reveal a portal's destination and requirements\n• Stability: Unstable portals may close unexpectedly or lead to random destinations\n• Guardians: Important portals are often guarded by creatures or magical wards\n• Creation: High-level spells like gate can create temporary portals"
        },
        {
            name: "Suffocation",
            category: "Adventuring",
            description: "A creature can hold its breath for a number of minutes equal to 1 + its Constitution modifier (minimum of 30 seconds).\n\nWhen a creature runs out of breath or is choking, it can survive for a number of rounds equal to its Constitution modifier (minimum of 1 round). At the start of its next turn, it drops to 0 hit points and is dying, and it can't regain hit points or be stabilized until it can breathe again.\n\nIn wildspace, air envelopes provide breathable air, but when air becomes fouled, creatures must make Constitution saves to avoid exhaustion."
        },
        {
            name: "Falling",
            category: "Adventuring",
            description: "A fall from a great height is one of the most common hazards. At the end of a fall, a creature takes 1d6 bludgeoning damage for every 10 feet it fell, to a maximum of 20d6. The creature lands prone, unless it avoids taking damage from the fall.\n\nIn wildspace, falling works differently: a creature that falls off a ship continues moving in the same direction at the same speed until it encounters another gravity field. This can result in creatures floating in space indefinitely."
        }
    ]
};

let currentCompendiumCategory = 'spells';
let compendiumSearchQuery = '';

function showCompendiumCategory(category) {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.querySelector(`[onclick*="'${category}'"]`);
    if (activeBtn) activeBtn.classList.add('active');
    
    currentCompendiumCategory = category;
    compendiumSearchQuery = '';
    document.getElementById('compendium-search').value = '';
    renderCompendium();
}

function searchCompendium() {
    compendiumSearchQuery = document.getElementById('compendium-search').value.toLowerCase();
    renderCompendium();
}

function renderCompendium() {
    const content = document.getElementById('compendium-content');
    const data = compendiumData[currentCompendiumCategory];
    
    let filtered = data;
    if (compendiumSearchQuery) {
        filtered = data.filter(item => 
            item.name.toLowerCase().includes(compendiumSearchQuery) ||
            (item.description && item.description.toLowerCase().includes(compendiumSearchQuery))
        );
    }
    
    if (filtered.length === 0) {
        content.innerHTML = '<p class="empty-state">No results found.</p>';
        return;
    }
    
    let html = `<h2>${currentCompendiumCategory.charAt(0).toUpperCase() + currentCompendiumCategory.slice(1)}</h2>`;
    
    if (currentCompendiumCategory === 'spells') {
        html += '<div class="compendium-list">';
        filtered.forEach(spell => {
            html += `
                <div class="compendium-item">
                    <h3>${spell.name}</h3>
                    <p class="item-meta">
                        <strong>Level ${spell.level} ${spell.school}</strong> | 
                        Casting Time: ${spell.castingTime} | 
                        Range: ${spell.range}
                    </p>
                    <p><strong>Components:</strong> ${spell.components}</p>
                    <p><strong>Duration:</strong> ${spell.duration}</p>
                    <p>${spell.description}</p>
                    ${spell.higherLevels ? `<p><strong>At Higher Levels:</strong> ${spell.higherLevels}</p>` : ''}
                </div>
            `;
        });
        html += '</div>';
    } else if (currentCompendiumCategory === 'items') {
        html += '<div class="compendium-list">';
        filtered.forEach(item => {
            html += `
                <div class="compendium-item">
                    <h3>${item.name}</h3>
                    <p class="item-meta">
                        <strong>${item.type}</strong> | 
                        ${item.rarity} | 
                        ${item.cost}
                        ${item.attunement ? ` | ${item.attunement}` : ''}
                    </p>
                    ${item.weight ? `<p><strong>Weight:</strong> ${item.weight}</p>` : ''}
                    ${item.properties ? `<p><strong>Properties:</strong> ${item.properties}</p>` : ''}
                    <p>${item.description}</p>
                </div>
            `;
        });
        html += '</div>';
    } else if (currentCompendiumCategory === 'monsters') {
        html += '<div class="compendium-list">';
        filtered.forEach(monster => {
            html += `
                <div class="compendium-item monster-stat-block">
                    <h3>${monster.name}</h3>
                    <p class="item-meta"><em>${monster.type}, CR ${monster.cr}</em></p>
                    <hr>
                    <p><strong>Armor Class:</strong> ${monster.ac}</p>
                    <p><strong>Hit Points:</strong> ${monster.hp}</p>
                    <p><strong>Speed:</strong> ${monster.speed}</p>
                    <hr>
                    <div class="monster-stats">
                        <div><strong>STR</strong><br>${monster.stats.str} (${Math.floor((monster.stats.str - 10) / 2) >= 0 ? '+' : ''}${Math.floor((monster.stats.str - 10) / 2)})</div>
                        <div><strong>DEX</strong><br>${monster.stats.dex} (${Math.floor((monster.stats.dex - 10) / 2) >= 0 ? '+' : ''}${Math.floor((monster.stats.dex - 10) / 2)})</div>
                        <div><strong>CON</strong><br>${monster.stats.con} (${Math.floor((monster.stats.con - 10) / 2) >= 0 ? '+' : ''}${Math.floor((monster.stats.con - 10) / 2)})</div>
                        <div><strong>INT</strong><br>${monster.stats.int} (${Math.floor((monster.stats.int - 10) / 2) >= 0 ? '+' : ''}${Math.floor((monster.stats.int - 10) / 2)})</div>
                        <div><strong>WIS</strong><br>${monster.stats.wis} (${Math.floor((monster.stats.wis - 10) / 2) >= 0 ? '+' : ''}${Math.floor((monster.stats.wis - 10) / 2)})</div>
                        <div><strong>CHA</strong><br>${monster.stats.cha} (${Math.floor((monster.stats.cha - 10) / 2) >= 0 ? '+' : ''}${Math.floor((monster.stats.cha - 10) / 2)})</div>
                    </div>
                    <hr>
                    ${monster.saves ? `<p><strong>Saving Throws:</strong> ${monster.saves}</p>` : ''}
                    ${monster.skills ? `<p><strong>Skills:</strong> ${monster.skills}</p>` : ''}
                    ${monster.immunities ? `<p><strong>Damage Immunities:</strong> ${monster.immunities}</p>` : ''}
                    <p><strong>Senses:</strong> ${monster.senses}</p>
                    <p><strong>Languages:</strong> ${monster.languages}</p>
                    <hr>
                    ${monster.traits.length > 0 ? monster.traits.map(trait => `
                        <p><strong>${trait.name}.</strong> ${trait.description}</p>
                    `).join('') : ''}
                    <h4>Actions</h4>
                    ${monster.actions.map(action => `
                        <p><strong>${action.name}.</strong> ${action.description}</p>
                    `).join('')}
                </div>
            `;
        });
        html += '</div>';
    } else if (currentCompendiumCategory === 'rules') {
        html += '<div class="compendium-list">';
        filtered.forEach(rule => {
            html += `
                <div class="compendium-item">
                    <h3>${rule.name}</h3>
                    <p class="item-meta"><strong>${rule.category}</strong></p>
                    <p style="white-space: pre-line;">${rule.description}</p>
                </div>
            `;
        });
        html += '</div>';
    }
    
    content.innerHTML = html;
}

// ===== SPELL SLOT TRACKING =====
function toggleSpellSlot(characterName, level, slotNumber) {
    const charKey = characterName.toLowerCase();
    const char = campaignData.characters[charKey];
    
    if (!char || !char.spellSlots[level]) return;
    
    const checkbox = document.getElementById(`${charKey}-slot-${level}-${slotNumber}`);
    if (!checkbox) return;
    
    // Count currently checked slots
    let checkedCount = 0;
    for (let i = 1; i <= char.spellSlots[level].max; i++) {
        const cb = document.getElementById(`${charKey}-slot-${level}-${i}`);
        if (cb && cb.checked) checkedCount++;
    }
    
    char.spellSlots[level].current = checkedCount;
    saveCampaignData();
}

function shortRest(characterName) {
    const charKey = characterName.toLowerCase();
    const char = campaignData.characters[charKey];
    
    if (!char) return;
    
    // Warlocks restore spell slots on short rest
    // For now, just show a message
    alert(`${char.name} takes a short rest. Some class features may be restored.`);
    saveCampaignData();
}

function longRest(characterName) {
    const charKey = characterName.toLowerCase();
    const char = campaignData.characters[charKey];
    
    if (!char) return;
    
    // Restore HP to max
    char.currentHp = char.maxHp;
    char.tempHp = 0;
    
    // Restore all spell slots
    for (let level in char.spellSlots) {
        char.spellSlots[level].current = char.spellSlots[level].max;
    }
    
    // Restore hit dice (up to half max)
    char.hitDice = Math.min(char.maxHitDice, char.hitDice + Math.floor(char.maxHitDice / 2));
    
    updateHPDisplay(charKey);
    
    // Update spell slot checkboxes if character sheet is currently displayed
    for (let level in char.spellSlots) {
        for (let i = 1; i <= char.spellSlots[level].max; i++) {
            const checkbox = document.getElementById(`${charKey}-slot-${level}-${i}`);
            if (checkbox) {
                checkbox.checked = i <= char.spellSlots[level].current;
            }
        }
    }
    
    alert(`${char.name} completes a long rest! HP, spell slots, and hit dice restored.`);
    saveCampaignData();
}

// ===== HIT DICE =====
function spendHitDice(characterName) {
    const charKey = characterName.toLowerCase();
    const char = campaignData.characters[charKey];
    
    if (!char || char.hitDice === 0) return;
    
    const roll = Math.floor(Math.random() * char.hitDie) + 1;
    const healing = roll + char.conModifier;
    
    char.hitDice--;
    char.currentHp = Math.min(char.maxHp, char.currentHp + healing);
    
    alert(`${char.name} spends a hit die and rolls ${roll} + ${char.conModifier} = ${healing} HP restored!`);
    
    updateHPDisplay(charKey);
    showCharacter(charKey); // Refresh display
    saveCampaignData();
}

// ===== DEATH SAVES =====
function stabilize(characterName) {
    const charKey = characterName.toLowerCase();
    const char = campaignData.characters[charKey];
    
    if (!char) return;
    
    // Set HP to 1
    char.currentHp = 1;
    
    // Clear death save checkboxes
    for (let i = 1; i <= 3; i++) {
        const successBox = document.getElementById(`${charKey}-success-${i}`);
        const failBox = document.getElementById(`${charKey}-fail-${i}`);
        if (successBox) successBox.checked = false;
        if (failBox) failBox.checked = false;
    }
    
    updateHPDisplay(charKey);
    alert(`${char.name} has been stabilized!`);
    saveCampaignData();
}

// ===== MISSING FUNCTIONS =====
function scrollToTop() {
    const compendiumContent = document.getElementById('compendium-content');
    if (compendiumContent) {
        compendiumContent.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

function updateCompendiumSort() {
    const sortValue = document.getElementById('compendium-sort').value;
    const data = compendiumData[currentCompendiumCategory];
    
    let sorted = [...data];
    
    switch(sortValue) {
        case 'name-asc':
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            sorted.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'level-asc':
            if (currentCompendiumCategory === 'spells') {
                sorted.sort((a, b) => a.level - b.level);
            }
            break;
        case 'level-desc':
            if (currentCompendiumCategory === 'spells') {
                sorted.sort((a, b) => b.level - a.level);
            }
            break;
        case 'cr-asc':
            if (currentCompendiumCategory === 'monsters') {
                sorted.sort((a, b) => parseCR(a.cr) - parseCR(b.cr));
            }
            break;
        case 'cr-desc':
            if (currentCompendiumCategory === 'monsters') {
                sorted.sort((a, b) => parseCR(b.cr) - parseCR(a.cr));
            }
            break;
    }
    
    compendiumData[currentCompendiumCategory] = sorted;
    renderCompendium();
}

function parseCR(cr) {
    if (cr.includes('/')) {
        const parts = cr.split('/');
        return parseInt(parts[0]) / parseInt(parts[1]);
    }
    return parseInt(cr);
}

// ===== CONDITIONS TRACKER =====
function addCondition(characterName) {
    const charKey = characterName.toLowerCase();
    const char = campaignData.characters[charKey];
    
    if (!char) return;
    
    const selectElement = document.getElementById(`${charKey}-condition-select`);
    if (!selectElement) return;
    
    const condition = selectElement.value;
    if (!condition) return;
    
    // Check if condition already exists
    if (char.conditions.includes(condition)) {
        alert(`${char.name} already has the ${condition} condition.`);
        return;
    }
    
    // Add condition to character data
    char.conditions.push(condition);
    
    // Reset select
    selectElement.value = '';
    
    // Update display
    updateConditionsDisplay(charKey);
    saveCampaignData();
}

function removeCondition(characterName, condition) {
    const charKey = characterName.toLowerCase();
    const char = campaignData.characters[charKey];
    
    if (!char) return;
    
    // Remove condition from array
    char.conditions = char.conditions.filter(c => c !== condition);
    
    // Update display
    updateConditionsDisplay(charKey);
    saveCampaignData();
}

function updateConditionsDisplay(charKey) {
    const char = campaignData.characters[charKey];
    if (!char) return;
    
    const conditionsDiv = document.getElementById(`${charKey}-active-conditions`);
    if (!conditionsDiv) return;
    
    if (char.conditions.length === 0) {
        conditionsDiv.innerHTML = '<p style="color: #999; font-style: italic; font-size: 0.9rem;">No active conditions</p>';
        return;
    }
    
    let html = '<div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem;">';
    char.conditions.forEach(condition => {
        html += `
            <div class="condition-badge" style="background: rgba(231, 76, 60, 0.2); border: 1px solid var(--accent-color); padding: 0.3rem 0.6rem; border-radius: 4px; display: flex; align-items: center; gap: 0.5rem;">
                <span style="text-transform: capitalize;">${condition}</span>
                <button onclick="removeCondition('${charKey}', '${condition}')" style="background: none; border: none; color: var(--accent-color); cursor: pointer; padding: 0; font-size: 1rem; line-height: 1;">✕</button>
            </div>
        `;
    });
    html += '</div>';
    
    conditionsDiv.innerHTML = html;
}

// ===== EXPORT/IMPORT CAMPAIGN DATA =====
function exportCampaignData() {
    const dataStr = JSON.stringify(campaignData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feyspace-campaign-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importCampaignData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = event => {
            try {
                const imported = JSON.parse(event.target.result);
                if (confirm('This will overwrite your current campaign. Continue?')) {
                    campaignData = imported;
                    saveCampaignData();
                    location.reload();
                }
            } catch (error) {
                alert('Invalid campaign file!');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}
