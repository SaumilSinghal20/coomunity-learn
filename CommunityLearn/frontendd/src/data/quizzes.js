export const QUIZZES_DATA = [
  { id:1,  title:'Algebra Fundamentals',     questions:5, difficulty:'Easy',   subject:'Mathematics', time:20, points:150 },
  { id:2,  title:'Calculus Challenge',       questions:5, difficulty:'Hard',   subject:'Mathematics', time:30, points:200 },
  { id:3,  title:'JavaScript ES6+',          questions:5, difficulty:'Medium', subject:'Programming', time:35, points:250 },
  { id:4,  title:'Python Basics',            questions:5, difficulty:'Easy',   subject:'Programming', time:25, points:200 },
  { id:5,  title:"Newton's Laws of Motion",  questions:5, difficulty:'Easy',   subject:'Physics',     time:20, points:150 },
  { id:6,  title:'Electromagnetic Waves',    questions:5, difficulty:'Medium', subject:'Physics',     time:30, points:200 },
  { id:7,  title:'Organic Chemistry Basics', questions:5, difficulty:'Medium', subject:'Chemistry',   time:35, points:250 },
  { id:8,  title:'Cell Biology Deep Dive',   questions:5, difficulty:'Medium', subject:'Biology',     time:25, points:200 },
  { id:9,  title:'English Grammar Mastery',  questions:5, difficulty:'Easy',   subject:'English',     time:40, points:300 },
  { id:10, title:'World History Quiz',       questions:5, difficulty:'Medium', subject:'History',     time:30, points:250 },
  { id:11, title:'Microeconomics Concepts',  questions:5, difficulty:'Hard',   subject:'Economics',   time:30, points:200 },
  { id:12, title:'Machine Learning Basics',  questions:5, difficulty:'Hard',   subject:'Data Science',time:35, points:200 },
  { id:13, title:'Psychology 101',           questions:5, difficulty:'Easy',   subject:'Psychology',  time:20, points:150 },
  { id:14, title:'Music Theory Quiz',        questions:5, difficulty:'Medium', subject:'Music',       time:20, points:150 },
  { id:15, title:'React Hooks & State',      questions:5, difficulty:'Hard',   subject:'Programming', time:25, points:150 },
];

export const QUIZ_QUESTIONS = {
  'Algebra Fundamentals': [
    { q:'What is the value of x in 2x + 4 = 10?', opts:['2','3','4','5'], ans:1 },
    { q:'Simplify: 3(x + 2)', opts:['3x+2','3x+6','3x+5','6x'], ans:1 },
    { q:'What is the slope of y = 3x + 7?', opts:['7','3','10','1'], ans:1 },
    { q:'Solve: x² = 25', opts:['x=5 only','x=±5','x=25','x=±25'], ans:1 },
    { q:'Quadratic formula?', opts:['x=(-b±√(b²-4ac))/2a','x=(b±√(b²+4ac))/2a','x=-b/2a','x=√(b²-4ac)'], ans:0 },
  ],
  'Calculus Challenge': [
    { q:'Derivative of x²?', opts:['x','2x','2','x³/3'], ans:1 },
    { q:'∫2x dx = ?', opts:['2','x²','x²+C','2x²+C'], ans:2 },
    { q:'Derivative of sin(x)?', opts:['-cos(x)','cos(x)','-sin(x)','tan(x)'], ans:1 },
    { q:'Limit of (sin x)/x as x→0?', opts:['0','∞','1','undefined'], ans:2 },
    { q:'Derivative of eˣ?', opts:['xeˣ⁻¹','eˣ','e','1'], ans:1 },
  ],
  'JavaScript ES6+': [
    { q:'What does "===" check?', opts:['Value only','Type only','Value and type','Reference'], ans:2 },
    { q:'typeof null returns?', opts:['"null"','"object"','"undefined"','"boolean"'], ans:1 },
    { q:'Block-scoped variable keyword?', opts:['var','let','function','class'], ans:1 },
    { q:'Array.map() returns?', opts:['Same array modified','A new array','undefined','boolean'], ans:1 },
    { q:'What is a Promise?', opts:['A loop','Async operation handler','Variable type','CSS property'], ans:1 },
  ],
  'Python Basics': [
    { q:'Output of print(type([]))?', opts:["<class 'list'>","<class 'array'>","<class 'tuple'>","<class 'dict'>"], ans:0 },
    { q:'How to define a function?', opts:['function myF():','def myF():','fun myF():','func myF():'], ans:1 },
    { q:'Exponentiation operator?', opts:['^','**','^^','exp()'], ans:1 },
    { q:'len("hello") returns?', opts:['4','5','6','Error'], ans:1 },
    { q:'List comprehension is?', opts:['A for loop','Concise list creation','Dict method','Class method'], ans:1 },
  ],
  "Newton's Laws of Motion": [
    { q:"Newton's First Law is also called?", opts:['Law of Acceleration','Law of Inertia','Action-Reaction','Gravity'], ans:1 },
    { q:"F = ma is Newton's ___ Law", opts:['First','Second','Third','Fourth'], ans:1 },
    { q:'SI unit of Force?', opts:['Joule','Watt','Newton','Pascal'], ans:2 },
    { q:'Body at rest stays at rest due to?', opts:['Friction','Gravity','Inertia','Momentum'], ans:2 },
    { q:'Action and reaction act on?', opts:['Same body','Different bodies','Neither','Same point'], ans:1 },
  ],
  'Organic Chemistry Basics': [
    { q:'Simplest organic compound?', opts:['Ethane','Methane','Propane','Butane'], ans:1 },
    { q:'Functional group of alcohols?', opts:['-COOH','-NH₂','-OH','-CHO'], ans:2 },
    { q:'Isomerism means?', opts:['Same formula, different structure','Different formula, same structure','Same everything','None'], ans:0 },
    { q:'Benzene has ___ carbon atoms?', opts:['4','5','6','8'], ans:2 },
    { q:'Example of an alkane?', opts:['Ethene','Ethyne','Ethane','Benzene'], ans:2 },
  ],
  'English Grammar Mastery': [
    { q:'A noun referring to a group is?', opts:['Proper','Abstract','Collective','Common'], ans:2 },
    { q:'"She runs fast" — "runs" is a?', opts:['Noun','Adjective','Verb','Adverb'], ans:2 },
    { q:'Passive voice sentence?', opts:['He ate the cake','The cake was eaten by him','He eats cake','He will eat cake'], ans:1 },
    { q:'"Neither John nor his friends ___ coming."', opts:['is','are','was','were'], ans:1 },
    { q:'"Beautiful" is an?', opts:['Adverb','Verb','Adjective','Noun'], ans:2 },
  ],
  'Electromagnetic Waves': [
    { q:'Speed of light in vacuum?', opts:['3×10⁸ m/s','3×10⁶ m/s','3×10¹⁰ m/s','3×10⁴ m/s'], ans:0 },
    { q:'EM waves are ___ waves', opts:['Mechanical','Longitudinal','Transverse','Sound'], ans:2 },
    { q:'Which has highest frequency?', opts:['Radio','Infrared','Gamma rays','X-rays'], ans:2 },
    { q:'Visible light range (nm)?', opts:['100-400','400-700','700-1000','1000+'], ans:1 },
    { q:'EM waves need medium?', opts:['Yes','No','Only in vacuum','Only in air'], ans:1 },
  ],
};

export const DEFAULT_QUESTIONS = (title) => [
  { q:`In ${title}, which is a fundamental concept?`, opts:['Basic Principle','Advanced Theory','Correct Answer','Complex Formula'], ans:2 },
  { q:`Primary method in ${title}?`, opts:['Option A','Correct Method','Option C','Option D'], ans:1 },
  { q:`Key formula in ${title}?`, opts:['Correct Formula','Option B','Option C','Option D'], ans:0 },
  { q:`${title} is categorized as?`, opts:['Option A','Option B','Option C','Correct Category'], ans:3 },
  { q:`Best approach to study ${title}?`, opts:['Option A','Practice Problems','Option C','Option D'], ans:1 },
];
