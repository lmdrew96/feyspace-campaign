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
    }
};

let diceHistory = [];
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
    event.target.classList.add('active');
    
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
}

function getTonySheet() {
    return `
        <div class="character-sheet interactive">
            <div class="character-header">
                <h2>💀 Ben "Tony" Bingletonarius</h2>
                <p class="job-title">PEEN - Protective Engagement & Emergency Negotiator</p>
                <p class="species">Human Skeleton • Bard • Level ${campaignData.level}</p>
            </div>
            
            <div class="char-stats-grid">
                <div class="stat-block clickable" onclick="rollAbilityCheck(0, 'STR')">
                    <div class="stat-name">STR</div>
                    <div class="stat-value">10</div>
                    <div class="stat-mod">+0</div>
                </div>
                <div class="stat-block clickable" onclick="rollAbilityCheck(2, 'DEX')">
                    <div class="stat-name">DEX</div>
                    <div class="stat-value">14</div>
                    <div class="stat-mod">+2</div>
                </div>
                <div class="stat-block clickable" onclick="rollAbilityCheck(1, 'CON')">
                    <div class="stat-name">CON</div>
                    <div class="stat-value">12</div>
                    <div class="stat-mod">+1</div>
                </div>
                <div class="stat-block clickable" onclick="rollAbilityCheck(0, 'INT')">
                    <div class="stat-name">INT</div>
                    <div class="stat-value">10</div>
                    <div class="stat-mod">+0</div>
                </div>
                <div class="stat-block clickable" onclick="rollAbilityCheck(1, 'WIS')">
                    <div class="stat-name">WIS</div>
                    <div class="stat-value">12</div>
                    <div class="stat-mod">+1</div>
                </div>
                <div class="stat-block clickable" onclick="rollAbilityCheck(3, 'CHA')">
                    <div class="stat-name">CHA</div>
                    <div class="stat-value">16</div>
                    <div class="stat-mod">+3</div>
                </div>
            </div>

            <div class="char-section">
                <h3>Combat Stats</h3>
                <div class="combat-stats">
                    <div class="combat-stat">
                        <strong>AC</strong>
                        <span>14</span>
                    </div>
                    <div class="combat-stat">
                        <strong>HP</strong>
                        <span>16</span>
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

            <div class="char-section">
                <h3>Personality</h3>
                <div class="catchphrase">"B-b-b-b-bad to the bone!"</div>
                <p>Short and blunt. Sarcastic humor. Forgets he's dead sometimes.</p>
            </div>
        </div>
    `;
}

function getFlowSheet() {
    return `
        <div class="character-sheet interactive">
            <div class="character-header">
                <h2>🫧 Flow Jello</h2>
                <p class="job-title">CLIT - Corporate Liaison & Interplanetary Talker</p>
                <p class="species">Plasmoid • Paladin • Level ${campaignData.level}</p>
            </div>
            
            <div class="char-stats-grid">
                <div class="stat-block clickable" onclick="rollAbilityCheck(3, 'STR')">
                    <div class="stat-name">STR</div>
                    <div class="stat-value">16</div>
                    <div class="stat-mod">+3</div>
                </div>
                <div class="stat-block clickable" onclick="rollAbilityCheck(0, 'DEX')">
                    <div class="stat-name">DEX</div>
                    <div class="stat-value">10</div>
                    <div class="stat-mod">+0</div>
                </div>
                <div class="stat-block clickable" onclick="rollAbilityCheck(2, 'CON')">
                    <div class="stat-name">CON</div>
                    <div class="stat-value">14</div>
                    <div class="stat-mod">+2</div>
                </div>
                <div class="stat-block clickable" onclick="rollAbilityCheck(1, 'INT')">
                    <div class="stat-name">INT</div>
                    <div class="stat-value">12</div>
                    <div class="stat-mod">+1</div>
                </div>
                <div class="stat-block clickable" onclick="rollAbilityCheck(0, 'WIS')">
                    <div class="stat-name">WIS</div>
                    <div class="stat-value">10</div>
                    <div class="stat-mod">+0</div>
                </div>
                <div class="stat-block clickable" onclick="rollAbilityCheck(3, 'CHA')">
                    <div class="stat-name">CHA</div>
                    <div class="stat-value">16</div>
                    <div class="stat-mod">+3</div>
                </div>
            </div>

            <div class="char-section">
                <h3>Combat Stats</h3>
                <div class="combat-stats">
                    <div class="combat-stat">
                        <strong>AC</strong>
                        <span>16</span>
                    </div>
                    <div class="combat-stat">
                        <strong>HP</strong>
                        <span>20</span>
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

            <div class="char-section">
                <h3>Personality</h3>
                <div class="catchphrase">"It's me. I'm the CLIT."</div>
                <p>Earnest professional. Internalized N.I.P.P.L.E.'s customer service training completely.</p>
            </div>
        </div>
    `;
}

function getBazSheet() {
    return `
        <div class="character-sheet interactive">
            <div class="character-header">
                <h2>🦗 Bazil "Baz"</h2>
                <p class="job-title">ASS - Applied Systems Specialist</p>
                <p class="species">Thri-Kreen (Cyborg) • Artificer • Level ${campaignData.level}</p>
            </div>
            
            <div class="char-stats-grid">
                <div class="stat-block clickable" onclick="rollAbilityCheck(2, 'STR')">
                    <div class="stat-name">STR</div>
                    <div class="stat-value">14</div>
                    <div class="stat-mod">+2</div>
                </div>
                <div class="stat-block clickable" onclick="rollAbilityCheck(2, 'DEX')">
                    <div class="stat-name">DEX</div>
                    <div class="stat-value">14</div>
                    <div class="stat-mod">+2</div>
                </div>
                <div class="stat-block clickable" onclick="rollAbilityCheck(1, 'CON')">
                    <div class="stat-name">CON</div>
                    <div class="stat-value">12</div>
                    <div class="stat-mod">+1</div>
                </div>
                <div class="stat-block clickable" onclick="rollAbilityCheck(3, 'INT')">
                    <div class="stat-name">INT</div>
                    <div class="stat-value">16</div>
                    <div class="stat-mod">+3</div>
                </div>
                <div class="stat-block clickable" onclick="rollAbilityCheck(1, 'WIS')">
                    <div class="stat-name">WIS</div>
                    <div class="stat-value">12</div>
                    <div class="stat-mod">+1</div>
                </div>
                <div class="stat-block clickable" onclick="rollAbilityCheck(-1, 'CHA')">
                    <div class="stat-name">CHA</div>
                    <div class="stat-value">8</div>
                    <div class="stat-mod">-1</div>
                </div>
            </div>

            <div class="char-section">
                <h3>Combat Stats</h3>
                <div class="combat-stats">
                    <div class="combat-stat">
                        <strong>AC</strong>
                        <span>15</span>
                    </div>
                    <div class="combat-stat">
                        <strong>HP</strong>
                        <span>18</span>
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

            <div class="char-section">
                <h3>Personality</h3>
                <div class="catchphrase">"If it works, it works."</div>
                <p>152 years old. Blue-collar dad energy. Quiet competence. Coffee addict.</p>
            </div>
        </div>
    `;
}

function getWispSheet() {
    return `
        <div class="character-sheet interactive">
            <div class="character-header">
                <h2>🔮 Wisperincheeks "Wisp"</h2>
                <p class="job-title">TOP - Trajectory Optimization Professional</p>
                <p class="species">Goliath • Warlock • Level ${campaignData.level}</p>
            </div>
            
            <div class="char-stats-grid">
                <div class="stat-block clickable" onclick="rollAbilityCheck(3, 'STR')">
                    <div class="stat-name">STR</div>
                    <div class="stat-value">16</div>
                    <div class="stat-mod">+3</div>
                </div>
                <div class="stat-block clickable" onclick="rollAbilityCheck(0, 'DEX')">
                    <div class="stat-name">DEX</div>
                    <div class="stat-value">10</div>
                    <div class="stat-mod">+0</div>
                </div>
                <div class="stat-block clickable" onclick="rollAbilityCheck(2, 'CON')">
                    <div class="stat-name">CON</div>
                    <div class="stat-value">14</div>
                    <div class="stat-mod">+2</div>
                </div>
                <div class="stat-block clickable" onclick="rollAbilityCheck(0, 'INT')">
                    <div class="stat-name">INT</div>
                    <div class="stat-value">10</div>
                    <div class="stat-mod">+0</div>
                </div>
                <div class="stat-block clickable" onclick="rollAbilityCheck(4, 'WIS')">
                    <div class="stat-name">WIS</div>
                    <div class="stat-value">18</div>
                    <div class="stat-mod">+4</div>
                </div>
                <div class="stat-block clickable" onclick="rollAbilityCheck(2, 'CHA')">
                    <div class="stat-name">CHA</div>
                    <div class="stat-value">14</div>
                    <div class="stat-mod">+2</div>
                </div>
            </div>

            <div class="char-section">
                <h3>Combat Stats</h3>
                <div class="combat-stats">
                    <div class="combat-stat">
                        <strong>AC</strong>
                        <span>13</span>
                    </div>
                    <div class="combat-stat">
                        <strong>HP</strong>
                        <span>19</span>
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

            <div class="char-section">
                <h3>Personality</h3>
                <div class="catchphrase">"We chillin'"</div>
                <p>20,000 years old. Not a people person. Spontaneous and intuitive. Secretly controls ship telepathically.</p>
            </div>
        </div>
    `;
}

function rollAbilityCheck(modifier, ability) {
    const roll = Math.floor(Math.random() * 20) + 1;
    const total = roll + modifier;
    alert(`${ability} Check: ${roll} + ${modifier} = ${total}`);
}

function rollInitiative(modifier, charName) {
    const roll = Math.floor(Math.random() * 20) + 1;
    const total = roll + modifier;
    alert(`${charName} Initiative: ${roll} + ${modifier} = ${total}`);
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
    
    event.target.classList.add('active');
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
    
    let detailText = '';
    if (numDice > 1 || modifier !== 0) {
        detailText = `(${rolls.join(' + ')}`;
        if (modifier > 0) detailText += ` + ${modifier}`;
        else if (modifier < 0) detailText += ` ${modifier}`;
        detailText += ')';
    }
    
    resultDiv.innerHTML = `
        <div style="font-size: 2rem; color: var(--secondary-color);">${total}</div>
        <div style="font-size: 1rem; color: #666;">${numDice}d${sides}${modifier !== 0 ? (modifier > 0 ? '+' + modifier : modifier) : ''} ${detailText}</div>
    `;
}

function addToDiceHistory(numDice, sides, modifier, total) {
    const timestamp = new Date().toLocaleTimeString();
    const entry = {
        roll: `${numDice}d${sides}${modifier !== 0 ? (modifier > 0 ? '+' + modifier : modifier) : ''}`,
        result: total,
        time: timestamp
    };
    
    diceHistory.unshift(entry);
    if (diceHistory.length > 10) diceHistory.pop();
    
    updateDiceHistory();
}

function updateDiceHistory() {
    const historyDiv = document.getElementById('dice-history');
    
    if (diceHistory.length === 0) {
        historyDiv.innerHTML = '<p style="color: #999; font-style: italic;">No rolls yet</p>';
        return;
    }
    
    let html = '<div style="margin-top: 1rem; border-top: 1px solid var(--border-color); padding-top: 0.5rem;">';
    html += '<strong>Recent Rolls:</strong>';
    
    diceHistory.forEach(entry => {
        html += `<div style="padding: 0.25rem 0; display: flex; justify-content: space-between;">
            <span>${entry.roll}: <strong>${entry.result}</strong></span>
            <span style="color: #999; font-size: 0.8rem;">${entry.time}</span>
        </div>`;
    });
    
    html += '</div>';
    historyDiv.innerHTML = html;
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
function showCompendiumCategory(category) {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    const content = document.getElementById('compendium-content');
    content.innerHTML = `<h2>${category.charAt(0).toUpperCase() + category.slice(1)}</h2><p>Compendium content coming soon...</p>`;
}

function searchCompendium() {
    const query = document.getElementById('compendium-search').value.toLowerCase();
    // Search functionality to be implemented
}
