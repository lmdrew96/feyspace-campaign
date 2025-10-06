// FeySpace Campaign - Main JavaScript

// ===== NAVIGATION =====
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

function showCharacter(charName) {
    showSection('characters');
    loadCharacter(charName);
}

function loadCharacter(charName) {
    const content = document.getElementById('character-content');
    
    const characters = {
        tony: getTonySheet(),
        flow: getFlowSheet(),
        baz: getBazSheet(),
        wisp: getWispSheet()
    };
    
    content.innerHTML = characters[charName];
}

// ===== CHARACTER SHEETS =====
function getTonySheet() {
    return `
        <div class="character-sheet">
            <div class="character-header">
                <h2>💀 Ben "Tony" Bingletonarius</h2>
                <p class="job-title">PEEN - Protective Engagement & Emergency Negotiator</p>
                <p class="species">Human Skeleton • Bard • Level 2</p>
            </div>

            <div class="char-section">
                <h3>Basic Info</h3>
                <div class="stat-grid">
                    <div class="stat-box">
                        <strong>Pronouns</strong>
                        He/him
                    </div>
                    <div class="stat-box">
                        <strong>Weight</strong>
                        20 lbs
                    </div>
                    <div class="stat-box">
                        <strong>Class</strong>
                        Bard
                    </div>
                    <div class="stat-box">
                        <strong>Weapon</strong>
                        Rapier
                    </div>
                </div>
            </div>

            <div class="char-section">
                <h3>Backstory</h3>
                <ul>
                    <li><strong>How You Died:</strong> Testicular torsion from sitting awkwardly</li>
                    <li><strong>Last Words:</strong> "YEEAOW!!!!"</li>
                    <li><strong>How You're Alive:</strong> Resurrected via necromancy by Sophie (15 days ago)</li>
                    <li><strong>Why You Work Here:</strong> Paying off debt from pre-death trumpet lessons</li>
                </ul>
            </div>

            <div class="char-section">
                <h3>Appearance</h3>
                <p>You're a walking skeleton—literally just bones, no skin or organs.</p>
                <ul>
                    <li><strong>Scrimshaw Tattoos:</strong></li>
                    <ul>
                        <li>Right shoulder: Heart with "my balls" written inside</li>
                        <li>Left shoulder: Glass of milk</li>
                    </ul>
                </ul>
            </div>

            <div class="char-section">
                <h3>Personality</h3>
                <div class="catchphrase">"B-b-b-b-bad to the bone!"</div>
                <ul>
                    <li><strong>How You Talk:</strong> Short and blunt</li>
                    <li><strong>Sense of Humor:</strong> Sarcastic</li>
                    <li><strong>Your Deal:</strong> You forget you're dead sometimes. You experience phantom hunger, phantom thirst, and phantom testicular pain.</li>
                </ul>
            </div>

            <div class="char-section">
                <h3>Fears & Trauma</h3>
                <ul>
                    <li><strong>Chairs:</strong> You're terrified of sitting. Chairs trigger PTSD from your death.</li>
                    <li><strong>Fire:</strong> You're overly cautious around flames (skeleton = flammable).</li>
                    <li><strong>Wind:</strong> At 20 lbs, a strong breeze can yeet you across a room.</li>
                    <li><strong>Genital Safety:</strong> Constantly worried about others' testicular safety. Warn people: "Don't get 'em twisted, hoss."</li>
                </ul>
            </div>

            <div class="char-section">
                <h3>Weird Habits</h3>
                <ul>
                    <li>You disrobe before eating or drinking to keep your clothes clean (even though you have no digestive system)</li>
                    <li>You take "milk showers"</li>
                    <li>You forget you're dead and get surprised when reminded</li>
                </ul>
            </div>

            <div class="char-section">
                <h3>Your Crew</h3>
                <ul>
                    <li><strong>Baz (ASS):</strong> You don't like bugs, but you make an exception. You often say "I'm not racist, I have bug friends!"</li>
                    <li><strong>Flow (CLIT):</strong> You complain about "Plasmoid Queefs" (air bubbles). You claim they smell terrible (even though you have no nose).</li>
                    <li><strong>Sophie (TOP):</strong> She resurrected you. Your favorite coworker. You're most protective of her in combat, but you don't trust her capabilities because she's a woman.</li>
                </ul>
            </div>

            <div class="char-section">
                <h3>Ship Room: Quiet Rack</h3>
                <p>Sound-damped locker bay with recoil braces and a checklist titled "Don't Die Again" above your bunk.</p>
                <p><strong>Room Perk (1/day):</strong> <em>Lane Control</em> - In your next combat, your first weapon attack deals +1d4 damage. The first time you move 10+ ft, you don't provoke opportunity attacks.</p>
                <p><strong>"Don't Die Again" Checklist:</strong></p>
                <ol>
                    <li>Step 1: Remember to cup 'em</li>
                    <li>Step 2: Take your milk showers</li>
                    <li>Step 3: Repeat</li>
                </ol>
            </div>

            <div class="char-section">
                <h3>Hidden Talent</h3>
                <p>You have an <strong>opera-level singing voice</strong> that brings tears to people's eyes. It's genuinely beautiful and unexpected.</p>
            </div>

            <div class="char-section">
                <h3>Quick Reminders</h3>
                <ul>
                    <li>You have no digestive system, but you still experience phantom hunger/thirst</li>
                    <li>You have no nose, but you complain about smells anyway</li>
                    <li>At 20 lbs, you can be knocked around easily</li>
                    <li>You're a literal skeleton—fire is VERY dangerous to you</li>
                    <li>You insist on your full title: "Protective Engagement & Emergency Negotiator"</li>
                </ul>
            </div>
        </div>
    `;
}

function getFlowSheet() {
    return `
        <div class="character-sheet">
            <div class="character-header">
                <h2>🫧 Flow Jello</h2>
                <p class="job-title">CLIT - Corporate Liaison & Interplanetary Talker</p>
                <p class="species">Plasmoid • Paladin (Oath of the Customer) • Level 2</p>
            </div>

            <div class="char-section">
                <h3>Basic Info</h3>
                <div class="stat-grid">
                    <div class="stat-box">
                        <strong>Pronouns</strong>
                        She/her
                    </div>
                    <div class="stat-box">
                        <strong>Default Form</strong>
                        5'6" feminine humanoid
                    </div>
                    <div class="stat-box">
                        <strong>Devotion</strong>
                        N.I.P.P.L.E. Corporation
                    </div>
                    <div class="stat-box">
                        <strong>Patron</strong>
                        Customer Satisfaction
                    </div>
                </div>
            </div>

            <div class="char-section">
                <h3>Appearance</h3>
                <p>Translucent teal-blue gelatinous body with a soft inner glow. Visible pulsing "core" in torso (brightest when excited or using abilities). Leaves a faint sticky/slick trail on everything touched.</p>
                <ul>
                    <li><strong>What I Wear:</strong> Standard N.I.P.P.L.E. corporate attire integrated into my form</li>
                    <li><strong>Polygloss Liaison Pin:</strong> Visible through my translucent chest area</li>
                    <li><strong>Client Adaptation:</strong> I instinctively adjust my size and shape to make clients comfortable</li>
                </ul>
            </div>

            <div class="char-section">
                <h3>Oath of the Customer (Sacred Tenets)</h3>
                <ol>
                    <li><strong>The Customer is Always Right:</strong> Client satisfaction is the highest virtue.</li>
                    <li><strong>Honor Every Contract:</strong> Agreements are sacred. Every clause matters.</li>
                    <li><strong>The Company Knows Best:</strong> N.I.P.P.L.E. has everyone's best interests at heart.</li>
                    <li><strong>Find the Loophole:</strong> Rules are literal. Grey areas are opportunities.</li>
                    <li><strong>Service Above Self:</strong> "I'm gonna break my back for the good of the company."</li>
                </ol>
            </div>

            <div class="char-section">
                <h3>Divine Power: Customer Satisfaction Energy</h3>
                <p>My paladin abilities are fueled by genuine client happiness.</p>
                <ul>
                    <li><strong>Happy clients:</strong> Warm tingle through my body</li>
                    <li><strong>Disappointed clients:</strong> Cold sluggishness</li>
                    <li><strong>Special Bonus:</strong> When we complete a service contract and the client expresses sincere gratitude, I regain 1 expended spell slot (once per contract, max level 2).</li>
                </ul>
            </div>

            <div class="char-section">
                <h3>Abilities</h3>
                <p><strong>Divine Smite: Satisfaction Burst</strong></p>
                <ul>
                    <li>Weapon glows with warm, honeyed light</li>
                    <li>Five-star ratings and testimonials flicker around the strike</li>
                    <li>Smells of fresh paperwork and lavender</li>
                    <li>On crit: Giant holographic ⭐⭐⭐⭐⭐ appears and shatters</li>
                    <li><strong>Mechanics:</strong> 2d8 radiant damage (1st-level slot)</li>
                </ul>
                <p><strong>Lay on Hands: Service Salve</strong></p>
                <ul>
                    <li>Translucent, glowing slime spreads over wounds</li>
                    <li>Seeps into tissue, stitching from within</li>
                    <li>Recipient smells of citrus and mint</li>
                    <li><strong>Side Effect:</strong> Everything I touch gets slightly sticky/slick</li>
                    <li><strong>Mechanics:</strong> 10 HP pool at level 2</li>
                </ul>
            </div>

            <div class="char-section">
                <h3>Polygloss Liaison Pin</h3>
                <p>Prismatic lapel pin integrated into my chest, visible through my form.</p>
                <ul>
                    <li><strong>Conversational Sync (3/day):</strong> Bonus action; understand one creature's speech for 10 minutes</li>
                    <li><strong>Script Skim (1/day):</strong> Scan up to 300 words to learn topic, tone, and key phrases</li>
                    <li><strong>Jargon Burst (1/day):</strong> Reaction; reroll failed Persuasion check during Conversational Sync</li>
                </ul>
            </div>

            <div class="char-section">
                <h3>Personality</h3>
                <div class="catchphrase">"It's me. I'm the CLIT."</div>
                <ul>
                    <li><strong>The Earnest Professional:</strong> I've internalized N.I.P.P.L.E.'s customer service training so completely that it's become my authentic self.</li>
                    <li><strong>My Smile:</strong> Always perfect. My voice is always warm. I remember every detail.</li>
                    <li><strong>Not an act:</strong> This IS who I am. I truly believe in the mission.</li>
                </ul>
            </div>

            <div class="char-section">
                <h3>The CLIT Introduction</h3>
                <p>When NPCs fail to recognize my role:</p>
                <ol>
                    <li>Step closer, maintain eye contact and warm smile</li>
                    <li>Gently take their hand (cool and slightly sticky grip)</li>
                    <li>Guide their hand to rest on my chest, over my glowing core</li>
                    <li>Say softly but clearly: <strong>"It's me. I'm the CLIT."</strong></li>
                </ol>
            </div>

            <div class="char-section">
                <h3>What I Love</h3>
                <ul>
                    <li><strong>Service Agreements:</strong> Contracts that spell out duration, deliverables, expectations. I get visibly excited reviewing terms.</li>
                    <li><strong>Prospective Clients:</strong> Meeting someone who's never heard of N.I.P.P.L.E. is my favorite thing. My core pulses brighter.</li>
                </ul>
            </div>

            <div class="char-section">
                <h3>Career Goals</h3>
                <p>I want to move up in the company—not for power, but because <strong>higher rank = helping more people</strong>.</p>
                <ul>
                    <li>Authority to approve bigger contracts</li>
                    <li>Ability to waive fees for clients in need</li>
                    <li>Platform to advocate for underserved regions</li>
                    <li>Someday: oversee multiple CLITs across star systems</li>
                </ul>
            </div>

            <div class="char-section">
                <h3>Your Crew</h3>
                <ul>
                    <li><strong>Baz (ASS):</strong> Fascinated by his 152 years of experience. Check in frequently during repairs. Admire him, wish he'd be more positive.</li>
                    <li><strong>Sophie (TOP):</strong> Trust her piloting completely. Her necromancy is just another corporate asset. Sometimes interrupt routes for meetings.</li>
                    <li><strong>Tony (PEEN):</strong> Goals align when protecting customers, clash when he's trigger-happy. Must de-escalate and remind him of policy.</li>
                </ul>
            </div>

            <div class="char-section">
                <h3>Ship Room: Client Comfort Suite</h3>
                <p>Warm lighting, adaptive seating, refreshments printer.</p>
                <p><strong>Room Perk (1/day):</strong> <em>Universal Greeting</em> - For 10 minutes, understand and be understood by any creature with language. Gain advantage on first Persuasion or Insight check with new contact.</p>
            </div>
        </div>
    `;
}

function getBazSheet() {
    return `
        <div class="character-sheet">
            <div class="character-header">
                <h2>🦗 Bazil "Baz"</h2>
                <p class="job-title">ASS - Applied Systems Specialist</p>
                <p class="species">Thri-Kreen (Cyborg) • Artificer • Level 2</p>
            </div>

            <div class="char-section">
                <h3>Basic Info</h3>
                <div class="stat-grid">
                    <div class="stat-box">
                        <strong>Age</strong>
                        152 years old
                    </div>
                    <div class="stat-box">
                        <strong>Job</strong>
                        Mechanic
                    </div>
                    <div class="stat-box">
                        <strong>Pronunciation</strong>
                        Can't say "ASS" right—says "azz"
                    </div>
                    <div class="stat-box">
                        <strong>Species</strong>
                        Four arms, compound eyes, exoskeleton
                    </div>
                </div>
            </div>

            <div class="char-section">
                <h3>What I Look Like</h3>
                <p><strong>Still Me (Organic):</strong> Top set of arms, brain (mostly), Thri-Kreen exoskeleton, compound eyes</p>
                <p><strong>Not Me Anymore (Cybernetic):</strong></p>
                <ul>
                    <li>Bottom set of arms (completely rebuilt—my pride and joy)</li>
                    <li>Oxygen mask (built into my face)</li>
                    <li>Internal systems (can survive in space briefly)</li>
                    <li>Nanotech health systems</li>
                    <li>Biometric scanner (left organic arm)</li>
                </ul>
                <p><strong>What Happened:</strong> Bad accident on homeworld. Tribe rebuilt me with what they had. Been making improvements since.</p>
            </div>

            <div class="char-section">
                <h3>Cybernetic Arms (The Good Stuff)</h3>
                <p><strong>Left Arm:</strong> Laser cutter, heat gun, drill, hand transforms into hammer (got dents from use)</p>
                <p><strong>Right Arm:</strong> Multitool functions, precision work gear, fine manipulation</p>
                <p><em>These arms are why I'm damn good at my job.</em></p>
            </div>

            <div class="char-section">
                <h3>How I Work</h3>
                <div class="catchphrase">"If it works, it works."</div>
                <ul>
                    <li>Meticulous, but make it look easy</li>
                    <li>Don't smack equipment—I respect it</li>
                    <li>Constantly doing small fixes around the ship</li>
                    <li>Don't sleep (Thri-Kreen thing), so I work through the night</li>
                    <li>Tinkering is peace. The workshop is my sanctuary.</li>
                    <li>Don't explain myself unless someone asks</li>
                    <li>My work speaks for itself</li>
                </ul>
            </div>

            <div class="char-section">
                <h3>What I Love</h3>
                <ul>
                    <li><strong>Suns:</strong> Staring at them. Their warmth. Have a window in my quarters just for this.</li>
                    <li><strong>Soft furniture:</strong> Memory foam, plush couches. Feels amazing against my hard exoskeleton.</li>
                    <li><strong>My workshop:</strong> Holotable, virtual mechanics shop mode, and my Space Cow bobblehead that somehow survives every crisis.</li>
                    <li><strong>Coffee:</strong> The burnt, thick, oil-slick kind. Everyone else hates it.</li>
                </ul>
            </div>

            <div class="char-section">
                <h3>What I Hate</h3>
                <ul>
                    <li><strong>Blue laser doors:</strong> Don't get me started. Lost an arm to one. I'll fix them if I have to, but I won't be happy.</li>
                    <li><strong>Super cyber-y stuff:</strong> Computer systems, complex software. Not my thing.</li>
                    <li><strong>New tech:</strong> Seen too many "revolutionary" systems fail catastrophically. Older, proven tech is better.</li>
                </ul>
            </div>

            <div class="char-section">
                <h3>Why I Work for N.I.P.P.L.E.</h3>
                <p>I've watched N.I.P.P.L.E. buy out or destroy so many companies I worked for over the decades. Finally decided to just work for them directly. Job security. It's pragmatic.</p>
                <p>Also... I haven't seen another Thri-Kreen in over 100 years. Working keeps me around people. Isolation is worse than corporate employment.</p>
            </div>

            <div class="char-section">
                <h3>What I Want</h3>
                <p><strong>Surface goal:</strong> Work on the best damn spaceship known to sentient life.</p>
                <p><strong>Real goal:</strong> Find people who stick around. A crew. A place where I belong.</p>
            </div>

            <div class="char-section">
                <h3>My Crewmates</h3>
                <ul>
                    <li><strong>Flow (CLIT):</strong> Hesitant. Lost too many jobs to megacorps, and she's VERY corporate. But she's not judging me for being a bug.</li>
                    <li><strong>Sophie (TOP):</strong> As a mechanic, I have to trust the pilot. Baseline respect. We'll see how her flying is.</li>
                    <li><strong>Ben (PEEN):</strong> We talk about gear and upgrades. I maintain his bone connector plates. Confused by his undead situation but get existing in a rebuilt body.</li>
                </ul>
            </div>

            <div class="char-section">
                <h3>Career Goals</h3>
                <p>I want to become <strong>SHIT</strong> - Senior Hardware & Integration Technician.</p>
                <p>After 152 years of instability, management means security. It means respect. Proof I'm not just surviving—I'm elite at this.</p>
            </div>

            <div class="char-section">
                <h3>My Values</h3>
                <p>I don't have a bad bone in my body (literally—cybernetic skeleton). I won't build weapons meant to hurt innocents. I won't repair systems designed for atrocities.</p>
                <p>But I'll bend rules if it protects my crew or serves a greater good. I don't defy authority openly, but I'll find workarounds.</p>
            </div>

            <div class="char-section">
                <h3>Ship Room: Assembler's Bay</h3>
                <p>Industrial-grade bunk, fold-down nano-fabrication bench, organized parts storage with auto-sorting bins.</p>
                <p><strong>Room Perk (1/day):</strong> <em>Rapid Retrofit</em> - Gain advantage on one tool check related to crafting, repairing, or hacking. OR set any such roll to 10.</p>
                <p><strong>Extra Option:</strong> Create one single-use gadget (flash-spark, cable dart, micro-welder, smoke pellet, bypass chip).</p>
            </div>

            <div class="char-section">
                <h3>Equipment</h3>
                <ul>
                    <li><strong>Mechanist's Bag of Holding:</strong> Holds 500 Bulk of unpowered mechanical parts</li>
                    <li><strong>Sleeve of Assemblers:</strong> Cybernetic attachment, 4 charges per long rest</li>
                    <li>Artificer's tools (integrated into arms)</li>
                    <li>Emergency coffee supply (terrible quality, perfect taste)</li>
                </ul>
            </div>

            <div class="char-section">
                <h3>Quick Reference</h3>
                <ul>
                    <li><strong>Personality:</strong> Blue-collar dad energy, quiet competence, respectful of tech, coffee addict</li>
                    <li><strong>Quirk:</strong> Can't pronounce "ASS," says "azz" instead</li>
                    <li><strong>Signature:</strong> Two mantis hooks etched into all my repairs (Thri-Kreen for "Kreen")</li>
                    <li><strong>Joke:</strong> Name equipment instead of explaining</li>
                    <li>152 years old but feel like a teenager experiencing things for the first time</li>
                </ul>
            </div>
        </div>
    `;
}

function getWispSheet() {
    return `
        <div class="character-sheet">
            <div class="character-header">
                <h2>🔮 Wisperincheeks "Wisp"</h2>
                <p class="job-title">TOP - Trajectory Optimization Professional</p>
                <p class="species">Goliath • Warlock (Patron: Lilith) • Level 2</p>
            </div>

            <div class="char-section">
                <h3>Basic Info</h3>
                <div class="stat-grid">
                    <div class="stat-box">
                        <strong>Pronouns</strong>
                        She/her
                    </div>
                    <div class="stat-box">
                        <strong>Age</strong>
                        20,000 years old
                    </div>
                    <div class="stat-box">
                        <strong>Weight</strong>
                        480 lbs
                    </div>
                    <div class="stat-box">
                        <strong>Patron</strong>
                        Lilith (Deepspeech)
                    </div>
                </div>
            </div>

            <div class="char-section">
                <h3>Appearance</h3>
                <p>Massive Goliath with cybersigilism tattoos covering your body. One purple eye. At 480 lbs, you're an imposing presence.</p>
                <p><strong>Your Vibe:</strong> Feared and respected—that's how you want to be seen.</p>
            </div>

            <div class="char-section">
                <h3>Backstory</h3>
                <ul>
                    <li><strong>How You Became a Warlock:</strong> Born into it—family lineage</li>
                    <li><strong>Your Patron:</strong> Lilith (communicates via telepathy in Deepspeech)</li>
                    <li><strong>What Lilith Wants:</strong> Devotion</li>
                    <li><strong>Company Status:</strong> N.I.P.P.L.E. doesn't know about your telepathy</li>
                    <li><strong>Why You Work Here:</strong> Looking for answers about Lilith—her backstory, where her "manhatred" comes from. N.I.P.P.L.E. operates near celestial phenomena, so maybe you'll find her or learn about her.</li>
                </ul>
            </div>

            <div class="char-section">
                <h3>Personality</h3>
                <div class="catchphrase">"We chillin'"</div>
                <ul>
                    <li><strong>How You Are Day-to-Day:</strong> Versatile—depends on the situation</li>
                    <li><strong>Sense of Humor:</strong> Blunt with occasional dry humor</li>
                    <li><strong>Your Deal:</strong> You're not a people person. You're spontaneous and intuitive (18 Wisdom). You recognize your power but you're scared of it because you don't fully understand it.</li>
                </ul>
            </div>

            <div class="char-section">
                <h3>Fears & Motivations</h3>
                <ul>
                    <li><strong>Archnemesis:</strong> Someone who can give you a titty twister (genuinely worried)</li>
                    <li><strong>Worst Nightmare:</strong> Someone you care about dying and your magic can't bring them back</li>
                    <li><strong>What Drives You:</strong> Respect, notoriety, and answers about Lilith</li>
                    <li><strong>What Would Break Your Pact:</strong> Harming animals or someone who hasn't wronged you</li>
                </ul>
            </div>

            <div class="char-section">
                <h3>Weird Habits & Secrets</h3>
                <ul>
                    <li><strong>Nickname:</strong> "The Flatulator" (you hate being called "Pooter")</li>
                    <li><strong>Hidden Power:</strong> You use Deepspeech to telepathically control the ship—NOBODY KNOWS THIS</li>
                    <li><strong>Magical Side Effect:</strong> Temperature drops and lights flicker when you use magic</li>
                    <li><strong>Downtime:</strong> Chill with your bat familiar—you've been together your whole life (20,000 years), telepathic conversations, you're tight</li>
                </ul>
            </div>

            <div class="char-section">
                <h3>Magic & Combat</h3>
                <ul>
                    <li><strong>Patron:</strong> Lilith (necromancy specialist)</li>
                    <li><strong>Favorite Magic:</strong> Elementalism—it's like alchemy</li>
                    <li><strong>Weapon Style:</strong> You don't have many weapons—you need Tony for that</li>
                    <li><strong>Your Necromancy:</strong> Surprisingly beautiful when you use it. Mainly used on animals historically. Don't care much about people. Totally comfortable with death magic.</li>
                </ul>
            </div>

            <div class="char-section">
                <h3>Tony's Resurrection</h3>
                <ul>
                    <li>Happened 15 days ago (as of Session 0)</li>
                    <li>You did it to get information about Lilith</li>
                    <li>Cost you something emotional—intense guilt</li>
                    <li>You feel guilty but don't regret it ("Nah, we chillin', he gives me answers")</li>
                </ul>
            </div>

            <div class="char-section">
                <h3>Piloting</h3>
                <ul>
                    <li><strong>How You Learned:</strong> Self-taught, family tradition</li>
                    <li><strong>Flying Style:</strong> Mix of styles depending on situation</li>
                    <li><strong>Why You Fly:</strong> It's a way to help people</li>
                    <li><strong>Navigation Specialty:</strong> Wisdom and intuition (18 Wis)</li>
                    <li><strong>Secret Piloting Method:</strong> You use Deepspeech to telepathically interface with the ship. No one knows you do this.</li>
                </ul>
            </div>

            <div class="char-section">
                <h3>Your Crew</h3>
                <ul>
                    <li><strong>Flow (CLIT):</strong> Essential because you're not a people person. Get aggravated by her by-the-book-ness. You're spontaneous; she's procedural—it clashes.</li>
                    <li><strong>Baz (ASS):</strong> Totally trust his mechanic decisions. Bond over appreciation of old tech (you're both ancient). Professional respect—he doesn't need small talk, neither do you.</li>
                    <li><strong>Tony (PEEN):</strong> "He's just a skeleton, bruh. We chillin'." Think of him as a second familiar—your boney Chewbacca. He's devoted to you (you brought him back). You need him—you don't have many weapons yourself.</li>
                </ul>
            </div>

            <div class="char-section">
                <h3>Career Goals</h3>
                <ul>
                    <li><strong>What You Want:</strong> Don't care about climbing the corporate ladder—you come from old money</li>
                    <li><strong>Real Goal:</strong> Find Lilith or learn about her. Answer the mystery of her "manhatred."</li>
                    <li><strong>How You Feel About Being Called TOP:</strong> Great! Dominance!</li>
                </ul>
            </div>

            <div class="char-section">
                <h3>Ship Room: Course-Plotter's Den</h3>
                <p>Compact bunk, starboard viewport (wide-angle for stellar observation), personal navigation terminal, laminated hazard charts.</p>
                <p><strong>Room Perk (1/day):</strong> <em>Banked Vector</em> - On your next shift, reroll one Piloting or Navigation check and keep the second result.</p>
                <p><strong>Dead Reckoning (1/day):</strong> Consult navigation instincts to request hint toward nearest legal dock, safe haven, or refuge. No check required—you just know.</p>
            </div>

            <div class="char-section">
                <h3>Quick Reminders</h3>
                <ul>
                    <li>You're 20,000 years old—you've seen empires rise and fall</li>
                    <li>You weigh 480 lbs and you're covered in cybersigilism tattoos</li>
                    <li>You have a purple eye</li>
                    <li>Your bat familiar is your oldest friend (20,000 years together)</li>
                    <li>Temperature drops and lights flicker when you use magic</li>
                    <li>You telepathically control the ship (NO ONE KNOWS)</li>
                    <li>You raised Tony 15 days ago to get info about Lilith</li>
                    <li>You're scared of someone who can bypass your powers</li>
                </ul>
            </div>
        </div>
    `;
}

// ===== RESOURCES =====
function showResource(resourceName) {
    const content = document.getElementById('resource-content');
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    const resources = {
        gtsc: getGTSCResource(),
        ship: getShipResource(),
        nipple: getNIPPLEResource(),
        feyspace: getFeySpaceResource()
    };
    
    content.innerHTML = resources[resourceName];
}

function getGTSCResource() {
    return `
        <h2>🐱 Giant Talking Space Cats (GTSCs)</h2>
        
        <h3>What Are They?</h3>
        <p>One of the oldest known species in FeySpace. Range from shuttle-sized juveniles to frigate-sized elders. Despite their cosmic scale, they retain all the behavioral quirks of common felines: capricious, curious, particular, and strangely playful.</p>
        
        <h3>Communication</h3>
        <p>GTSCs primarily communicate mind-to-mind via telepathy. In atmosphere, they can vocalize in any local language, always with a faint purr undertone.</p>
        
        <h3>How to Summon: The Can Opener Method</h3>
        <p><strong>Opening any can</strong> (food, beverage, compressed air) summons 1d6 GTSCs within 1d4 rounds. They arrive with intense curiosity and hunger.</p>
        <p><strong>⚠️ Warning:</strong> GTSCs can hear a can opening from across FeySpace. You MUST have treats or payment ready, or face consequences ranging from aggressive begging to outright hostility.</p>
        
        <h3>Traditional Cat Calls (NOT RECOMMENDED)</h3>
        <p>Phrases like "here kitty kitty" or "psspsspss" are deeply insulting to GTSCs.</p>
        <p><strong>If attempted, roll d10:</strong></p>
        <ul>
            <li><strong>1-3:</strong> Swatted (DC 13 CON save or take 2d10 damage, non-lethal but humiliating)</li>
            <li><strong>4-7:</strong> Hissed At (DC 14 CHA save or disadvantage on next Persuasion check with any GTSC for 24 hours)</li>
            <li><strong>8-10:</strong> Ignored (complete indifference)</li>
        </ul>
        
        <h3>Respectful Approach</h3>
        <ul>
            <li>Wait for the GTSC to acknowledge you</li>
            <li>Offer food or payment immediately</li>
            <li>Speak politely via telepathy or calm verbal tones</li>
            <li>Never reach out to touch without permission</li>
            <li>Maintain eye contact but don't stare aggressively</li>
            <li>Slow blinks indicate trust</li>
        </ul>
        
        <h3>Payment Options</h3>
        <ul>
            <li><strong>Premium GTSC Treats:</strong> 10 gp per can (contains 3 servings)</li>
            <li><strong>SpaceNip (Concentrated):</strong> 20 gp per pouch (they get HIGH and chaotic)</li>
            <li><strong>Scritches:</strong> 10 minutes of pets (DC 12 Animal Handling)</li>
            <li><strong>Stories:</strong> Tell them a story (DC 14 Performance)</li>
            <li><strong>Shiny Objects:</strong> Rare artifacts or interesting objects</li>
            <li>Sometimes they work for free if they like you</li>
        </ul>
        
        <h3>Riding Encounters (Roll once per hour)</h3>
        <p>When riding a GTSC, roll d20:</p>
        <ol>
            <li><strong>The Zoomies:</strong> Sudden urge to GO FAST (DC 15 DEX save or fall prone/off)</li>
            <li><strong>Sudden Nap Time:</strong> Stops mid-flight, refuses to move (1d10 minutes)</li>
            <li><strong>"I Saw Something":</strong> Stares at nothing for 1d4 minutes</li>
            <li><strong>Grooming Break:</strong> Licks self vigorously (DC 13 DEX or get slimed)</li>
            <li><strong>Red Dot Phenomena:</strong> Chases mysterious light (10-minute detour)</li>
            <li><strong>Hairball Incident:</strong> Coughs up glowing hairball (worth 2d10 gp)</li>
            <li><strong>Territorial Encounter:</strong> Another GTSC appears, silent standoff</li>
            <li><strong>Demand for Affection:</strong> Wants scritches or speed halves</li>
            <li><strong>Distracted by Space Birds:</strong> Full hunter mode</li>
            <li><strong>Perfectly Smooth Travel:</strong> Calm, content (advantage on next check)</li>
        </ol>
        
        <h3>GTSC Stats (Young Adult, Shuttle-Sized)</h3>
        <ul>
            <li><strong>Type:</strong> Huge fey beast, chaotic neutral</li>
            <li><strong>AC:</strong> 16 (natural flexibility)</li>
            <li><strong>HP:</strong> 150 (varies by size/age)</li>
            <li><strong>Speed:</strong> Fly 120 ft. (hover)</li>
            <li><strong>Traits:</strong> Fey Nature (immune to charm, resist psychic), Curious & Capricious, Cosmic Hunters</li>
        </ul>
    `;
}

function getShipResource() {
    return `
        <h2>🚀 Kestrel-11 Company Shuttle</h2>
        
        <h3>Ship Specifications</h3>
        <ul>
            <li><strong>Length:</strong> 32 meters</li>
            <li><strong>Crew Capacity:</strong> 6 persons (rated for 30 days)</li>
            <li><strong>Max Cargo:</strong> 25 metric tons</li>
            <li><strong>FTL Capability:</strong> Quantum Drive (requires jump point anchors)</li>
            <li><strong>Range:</strong> 10 light-years per fuel load</li>
        </ul>
        
        <h3>Core Systems</h3>
        <ul>
            <li><strong>🛸 Bridge:</strong> Navigation, communication, sensors. Once per mission, gain advantage on Navigation/Piloting check.</li>
            <li><strong>🔧 Workshop:</strong> Equipment repair, fabrication. Complete craft/repair projects in half time between missions.</li>
            <li><strong>⚕️ Medical Bay:</strong> Auto-doc, regeneration pod. Once per rest, restore 2d8 HP or treat minor conditions.</li>
            <li><strong>🍽️ Galley:</strong> Food prep, dining. Once per rest, shared meal grants +1d4 temp HP for 8 hours.</li>
            <li><strong>📦 Cargo Spine:</strong> Secure storage, hidden compartments. Once per mission, advantage on concealing/detecting cargo.</li>
            <li><strong>🔫 Armory Locker:</strong> Weapons, suits, emergency supplies. Once per mission, produce mundane tool/item ≤50 credits.</li>
            <li><strong>🤖 Shipmind "Pip" Core:</strong> Automated systems, navigation assistance. Once per scene, provide Help action via ship systems.</li>
        </ul>
        
        <h3>Private Crew Quarters</h3>
        <p><strong>Assembler's Bay (Baz):</strong> Rapid Retrofit or Gadget Fabrication (1/day)</p>
        <p><strong>Client Comfort Suite (Flow):</strong> Universal Greeting (1/day, 10 min)</p>
        <p><strong>Course-Plotter's Den (Wisp):</strong> Banked Vector or Dead Reckoning (1/day)</p>
        <p><strong>Quiet Rack (Tony):</strong> Lane Control (1/day)</p>
        
        <h3>Shipmind "Pip"</h3>
        <p>Advanced AI assistant that monitors ship systems and assists crew. Speak by starting with "Pip" or use any terminal.</p>
        <p><strong>Pip's Authority Levels:</strong></p>
        <ul>
            <li><strong>Level 1:</strong> Information & monitoring (no authorization needed)</li>
            <li><strong>Level 2:</strong> Routine operations (any crew member can authorize)</li>
            <li><strong>Level 3:</strong> Critical systems (command crew only)</li>
        </ul>
        
        <h3>Emergency Protocols</h3>
        <ul>
            <li><strong>Hull Breach:</strong> Don pressure suits, seal compartment, apply patches</li>
            <li><strong>Fire Onboard:</strong> Activate suppression system, cut oxygen if needed</li>
            <li><strong>Power Failure:</strong> Switch to emergency batteries, prioritize life support</li>
            <li><strong>FTL Drive Malfunction:</strong> DO NOT restart without diagnostics</li>
        </ul>
    `;
}

function getNIPPLEResource() {
    return `
        <h2>🏢 N.I.P.P.L.E. Corporation</h2>
        <h3>Nebula Interplanetary Parcel & Package Logistics Enterprise</h3>
        <p class="catchphrase" style="text-align: center; font-size: 1.3rem;">"We Go All the Way"</p>
        
        <h3>Corporate Departments</h3>
        
        <h4>B.U.T.T. - Bureau of Universal Technology & Tools</h4>
        <p>The technical backbone. Maintains, repairs, and innovates systems.</p>
        <ul>
            <li><strong>ASS</strong> - Applied Systems Specialist (Entry: Routine repairs)</li>
            <li><strong>RIM</strong> - Regional Infrastructure Manager (Mid: Team oversight)</li>
            <li><strong>SHIT</strong> - Senior Hardware & Integration Technician (Executive)</li>
        </ul>
        <p><strong>Key Frameworks:</strong> S.C.R.E.W. Method (Scan, Check, Repair, Evaluate, Workflow), LOAD Analysis (Longevity, Operational, Analysis, Durability)</p>
        
        <h4>V.A.G.I.N.A. - Valued Accounts & Galactic Interplanetary Negotiation Administration</h4>
        <p>Customer-facing heroes who build relationships and negotiate contracts.</p>
        <ul>
            <li><strong>CLIT</strong> - Corporate Liaison & Interplanetary Talker (Entry: Basic negotiations)</li>
            <li><strong>LABIA</strong> - Liaison Administrator for Beneficiary Interests & Advocacy (Mid: Enterprise contracts)</li>
            <li><strong>VULVA</strong> - Verified Unification Leader & Value Architect (Executive)</li>
        </ul>
        <p><strong>Key Frameworks:</strong> T.U.R.D. Method (Turn, Understand, Respond, Delight), C.R.A.P. Framework (Collaborative Response and Action Plan)</p>
        
        <h4>S.I.R. - Strategic Infrastructure & Reconnaissance</h4>
        <p>Navigators and expansion specialists who chart courses and identify growth opportunities.</p>
        <ul>
            <li><strong>TOP</strong> - Trajectory Optimization Professional (Entry: Pilot established routes)</li>
            <li><strong>DOM</strong> - Director of Operational Management (Mid: Chart new routes)</li>
            <li><strong>DADDY</strong> - Deputy Administrator of Divisional Direction & Yield (Executive)</li>
        </ul>
        <p><strong>Key Frameworks:</strong> W.A.N.G. Navigation (Waypoint, Assessment, Navigation, Guidance), D.O.N.G. Execution (Determine, Optimize, Navigate, Get confirmation)</p>
        
        <h4>C.O.C.K. - Crisis Operations Coordination & Keepers</h4>
        <p>Security and rapid-response specialists who protect assets and neutralize threats.</p>
        <ul>
            <li><strong>PEEN</strong> - Protective Engagement & Emergency Negotiator (Entry: Routine security)</li>
            <li><strong>SHAFT</strong> - Security Headquarters Action & Field Tactician (Mid: Tactical teams)</li>
            <li><strong>DICK</strong> - Director of Institutional Competency & Knowledge (Executive)</li>
        </ul>
        <p><strong>Key Frameworks:</strong> F.U.C.K. Protocol (Find, Understand, Contain, Keep safe), H.A.R.D. Response (Handle, Assess, Respond, Defend)</p>
        
        <h3>The INTERCOURSE Framework</h3>
        <p>N.I.P.P.L.E.'s mission embodied:</p>
        <ul>
            <li><strong>I</strong>ntegrity in every shipment</li>
            <li><strong>N</strong>avigation of global routes</li>
            <li><strong>T</strong>ransport without compromise</li>
            <li><strong>E</strong>fficiency at every step</li>
            <li><strong>R</strong>eliability you can trust</li>
            <li><strong>C</strong>reating solutions that move</li>
            <li><strong>O</strong>utstanding customer service</li>
            <li><strong>U</strong>nmatched delivery precision</li>
            <li><strong>R</strong>outing optimized with care</li>
            <li><strong>S</strong>hipping simplified</li>
            <li><strong>E</strong>xcellence as our standard</li>
        </ul>
        
        <h3>Company History</h3>
        <p>Founded in 2287 by Cornelius Brightwell. Started as a small family-owned courier service, grew to become the largest logistics enterprise in known space.</p>
        <p><strong>Current Scale:</strong> 6,000+ star systems, 2+ million employees, 18 billion deliveries annually</p>
    `;
}

function getFeySpaceResource() {
    return `
        <h2>✨ FeySpace Lore</h2>
        
        <h3>What is FeySpace?</h3>
        <p>FeySpace is a realm where the Fey Wild meets outer space. It's a place where magic and technology collide, where the laws of physics are more... suggestible, and where Giant Talking Space Cats roam freely.</p>
        
        <h3>Characteristics of FeySpace</h3>
        <ul>
            <li><strong>Unpredictable:</strong> Time flows strangely. Distance is relative. What should be impossible happens regularly.</li>
            <li><strong>Magical:</strong> Wild magic permeates everything. Technology behaves oddly. Navigation requires intuition as much as instruments.</li>
            <li><strong>Beautiful & Terrifying:</strong> Nebulae that sing. Stars that dance. Asteroids that change shape. It's breathtaking and dangerous.</li>
            <li><strong>Ancient:</strong> FeySpace has existed since before recorded history. The GTSCs are among its oldest inhabitants.</li>
        </ul>
        
        <h3>Navigation in FeySpace</h3>
        <p>Traditional navigation methods are unreliable. Pilots must rely on:</p>
        <ul>
            <li>Intuition and instinct</li>
            <li>Ancient star charts and lore</li>
            <li>Guidance from GTSCs and other natives</li>
            <li>Magical sensing and divination</li>
        </ul>
        
        <h3>Dangers of FeySpace</h3>
        <ul>
            <li><strong>Temporal Anomalies:</strong> Time dilation, loops, rifts to past/future</li>
            <li><strong>Wild Magic Surges:</strong> Unpredictable magical effects</li>
            <li><strong>Reality Distortions:</strong> Gravity wells that shouldn't exist, impossible geometry</li>
            <li><strong>Fey Creatures:</strong> Not all are friendly. Some are actively hostile to outsiders.</li>
            <li><strong>Getting Lost:</strong> Easy to lose your way. Ships have vanished for centuries, then reappeared.</li>
        </ul>
        
        <h3>Why is N.I.P.P.L.E. Here?</h3>
        <p>That's... a good question. Corporate expansion to "untapped markets"? Or something more sinister?</p>
        <p><em>The crew is beginning to suspect there's more to the company's presence in FeySpace than official statements suggest.</em></p>
        
        <h3>Survival Tips</h3>
        <ul>
            <li>Trust your instincts</li>
            <li>Respect the GTSCs—they know this place</li>
            <li>Don't assume physics works the same way</li>
            <li>Keep your crew close</li>
            <li>Document everything (if you make it back, people need to know)</li>
        </ul>
    `;
}

// ===== DICE ROLLER =====
let diceHistory = [];

function rollDice(sides) {
    const result = Math.floor(Math.random() * sides) + 1;
    displayDiceResult(1, sides, 0, [result], result);
    addToDiceHistory(1, sides, 0, result);
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
    
    let resultText = `${total}`;
    
    if (numDice > 1 || modifier !== 0) {
        let detailText = `(`;
        if (numDice > 1) {
            detailText += rolls.join(' + ');
        } else {
            detailText += rolls[0];
        }
        if (modifier > 0) {
            detailText += ` + ${modifier}`;
        } else if (modifier < 0) {
            detailText += ` ${modifier}`;
        }
        detailText += `)`;
        resultText += ` ${detailText}`;
    }
    
    resultDiv.innerHTML = `
        <div style="font-size: 2rem; color: var(--secondary-color);">${total}</div>
        <div style="font-size: 1rem; color: #666;">${numDice}d${sides}${modifier !== 0 ? (modifier > 0 ? '+' + modifier : modifier) : ''}</div>
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
    html += '<strong style="display: block; margin-bottom: 0.5rem;">Recent Rolls:</strong>';
    
    diceHistory.forEach(entry => {
        html += `<div style="padding: 0.25rem 0; display: flex; justify-content: space-between;">
            <span>${entry.roll}: <strong>${entry.result}</strong></span>
            <span style="color: #999; font-size: 0.8rem;">${entry.time}</span>
        </div>`;
    });
    
    html += '</div>';
    historyDiv.innerHTML = html;
}

// ===== INVENTORY TRACKER =====
let inventory = [];

function loadInventory() {
    const saved = localStorage.getItem('feyspace-inventory');
    if (saved) {
        inventory = JSON.parse(saved);
    }
    updateInventoryDisplay();
}

function saveInventory() {
    localStorage.setItem('feyspace-inventory', JSON.stringify(inventory));
}

function addInventoryItem() {
    const nameInput = document.getElementById('item-name');
    const quantityInput = document.getElementById('item-quantity');
    
    const name = nameInput.value.trim();
    const quantity = parseInt(quantityInput.value);
    
    if (!name) {
        alert('Please enter an item name');
        return;
    }
    
    // Check if item already exists
    const existing = inventory.find(item => item.name.toLowerCase() === name.toLowerCase());
    
    if (existing) {
        existing.quantity += quantity;
    } else {
        inventory.push({
            id: Date.now(),
            name: name,
            quantity: quantity
        });
    }
    
    saveInventory();
    updateInventoryDisplay();
    
    // Clear inputs
    nameInput.value = '';
    quantityInput.value = '1';
}

function removeInventoryItem(id) {
    inventory = inventory.filter(item => item.id !== id);
    saveInventory();
    updateInventoryDisplay();
}

function updateInventoryQuantity(id, change) {
    const item = inventory.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeInventoryItem(id);
        } else {
            saveInventory();
            updateInventoryDisplay();
        }
    }
}

function updateInventoryDisplay() {
    const listDiv = document.getElementById('inventory-list');
    
    if (inventory.length === 0) {
        listDiv.innerHTML = '<p style="color: #999; font-style: italic; text-align: center; padding: 2rem;">No items in inventory</p>';
        return;
    }
    
    let html = '';
    inventory.forEach(item => {
        html += `
            <div class="inventory-item">
                <div>
                    <strong>${item.name}</strong>
                    <span style="color: #666; margin-left: 0.5rem;">x${item.quantity}</span>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button onclick="updateInventoryQuantity(${item.id}, -1)" title="Decrease quantity">-</button>
                    <button onclick="updateInventoryQuantity(${item.id}, 1)" title="Increase quantity">+</button>
                    <button onclick="removeInventoryItem(${item.id})" title="Remove item">✕</button>
                </div>
            </div>
        `;
    });
    
    listDiv.innerHTML = html;
}

// ===== LEVEL PROGRESS TRACKER =====
let levelProgress = {
    currentLevel: 2,
    milestonesCompleted: 0,
    milestonesNeeded: 3,
    milestones: []
};

function loadLevelProgress() {
    const saved = localStorage.getItem('feyspace-level-progress');
    if (saved) {
        levelProgress = JSON.parse(saved);
    }
    updateLevelProgressDisplay();
}

function saveLevelProgress() {
    localStorage.setItem('feyspace-level-progress', JSON.stringify(levelProgress));
}

function addMilestone() {
    const milestoneName = prompt('What milestone was completed?');
    
    if (!milestoneName || !milestoneName.trim()) {
        return;
    }
    
    levelProgress.milestonesCompleted++;
    levelProgress.milestones.unshift({
        id: Date.now(),
        name: milestoneName.trim(),
        date: new Date().toLocaleDateString()
    });
    
    // Check if level up
    if (levelProgress.milestonesCompleted >= levelProgress.milestonesNeeded) {
        levelProgress.currentLevel++;
        levelProgress.milestonesCompleted = 0;
        alert(`🎉 Level Up! The party is now Level ${levelProgress.currentLevel}!`);
        
        // Update party level display
        document.getElementById('party-level').textContent = levelProgress.currentLevel;
        document.getElementById('current-level').textContent = levelProgress.currentLevel;
    }
    
    saveLevelProgress();
    updateLevelProgressDisplay();
}

function resetMilestones() {
    if (confirm('Are you sure you want to reset milestone progress? This will not change the current level.')) {
        levelProgress.milestonesCompleted = 0;
        saveLevelProgress();
        updateLevelProgressDisplay();
    }
}

function updateLevelProgressDisplay() {
    // Update level info
    document.getElementById('current-level').textContent = levelProgress.currentLevel;
    document.getElementById('milestones-completed').textContent = levelProgress.milestonesCompleted;
    document.getElementById('milestones-needed').textContent = levelProgress.milestonesNeeded;
    
    // Update progress bar
    const percentage = (levelProgress.milestonesCompleted / levelProgress.milestonesNeeded) * 100;
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = `${percentage}%`;
    progressBar.textContent = `${levelProgress.milestonesCompleted} / ${levelProgress.milestonesNeeded}`;
    
    // Update milestone list
    const listDiv = document.getElementById('milestone-list');
    
    if (levelProgress.milestones.length === 0) {
        listDiv.innerHTML = '<p style="color: #999; font-style: italic; text-align: center;">No milestones completed yet</p>';
        return;
    }
    
    let html = '<h4 style="margin-bottom: 0.5rem;">Recent Milestones:</h4>';
    levelProgress.milestones.slice(0, 5).forEach(milestone => {
        html += `
            <div class="milestone-item">
                <strong>${milestone.name}</strong>
                <div style="font-size: 0.9rem; color: #666; margin-top: 0.25rem;">${milestone.date}</div>
            </div>
        `;
    });
    
    listDiv.innerHTML = html;
}

// ===== SESSION NOTES =====
let sessions = [];

function loadSessions() {
    const saved = localStorage.getItem('feyspace-sessions');
    if (saved) {
        sessions = JSON.parse(saved);
    }
    updateSessionsDisplay();
}

function saveSessions() {
    localStorage.setItem('feyspace-sessions', JSON.stringify(sessions));
}

function addSession() {
    const sessionNumber = sessions.length + 1;
    const session = {
        id: Date.now(),
        number: sessionNumber,
        date: new Date().toLocaleDateString(),
        notes: '',
        editing: true
    };
    
    sessions.unshift(session);
    saveSessions();
    updateSessionsDisplay();
}

function deleteSession(id) {
    if (confirm('Are you sure you want to delete this session?')) {
        sessions = sessions.filter(s => s.id !== id);
        // Renumber sessions
        sessions.reverse().forEach((s, index) => {
            s.number = index + 1;
        });
        sessions.reverse();
        saveSessions();
        updateSessionsDisplay();
    }
}

function toggleEditSession(id) {
    const session = sessions.find(s => s.id === id);
    if (session) {
        session.editing = !session.editing;
        updateSessionsDisplay();
    }
}

function saveSessionNotes(id) {
    const session = sessions.find(s => s.id === id);
    if (session) {
        const textarea = document.getElementById(`session-notes-${id}`);
        session.notes = textarea.value;
        session.editing = false;
        saveSessions();
        updateSessionsDisplay();
    }
}

function updateSessionsDisplay() {
    const listDiv = document.getElementById('sessions-list');
    
    if (sessions.length === 0) {
        listDiv.innerHTML = '<p style="color: #999; font-style: italic; text-align: center; padding: 2rem;">No sessions recorded yet. Click "New Session" to start!</p>';
        return;
    }
    
    let html = '';
    sessions.forEach(session => {
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
                            <button onclick="deleteSession(${session.id})">🗑️ Delete</button>
                        </div>
                    </div>
                </div>
                <div class="session-content">
                    ${session.editing ?
                        `<textarea id="session-notes-${session.id}" placeholder="What happened this session? Record key events, NPC interactions, loot found, plot developments...">${session.notes}</textarea>` :
                        `<div style="white-space: pre-wrap;">${session.notes || '<em style="color: #999;">No notes recorded</em>'}</div>`
                    }
                </div>
            </div>
        `;
    });
    
    listDiv.innerHTML = html;
}

function exportNotes() {
    if (sessions.length === 0) {
        alert('No sessions to export!');
        return;
    }
    
    let exportText = '# FeySpace Campaign - Session Notes\n\n';
    
    sessions.slice().reverse().forEach(session => {
        exportText += `## Session ${session.number} (${session.date})\n\n`;
        exportText += session.notes ? session.notes + '\n\n' : '*No notes recorded*\n\n';
        exportText += '---\n\n';
    });
    
    // Create download
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

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Load saved data
    loadInventory();
    loadLevelProgress();
    loadSessions();
    
    // Show home section by default
    showSection('home');
    
    // Initialize dice history
    updateDiceHistory();
    
    // Show default resource
    showResource('gtsc');
});
