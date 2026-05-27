import type {
  Lesson,
  ReadAloudContent,
  DialogueScene,
  SignageItem,
  SignageQuestion,
  Milestone,
  AssessmentScores,
} from '@/types';

export const readAloudContents: ReadAloudContent[] = [
  {
    id: 'ra_001',
    text: "I'd like to buy this medicine.",
    textCn: '我想买这个药。',
    keywords: ['medicine', 'buy'],
  },
  {
    id: 'ra_002',
    text: 'Where is the nearest pharmacy?',
    textCn: '最近的药房在哪里？',
    keywords: ['nearest', 'pharmacy'],
  },
  {
    id: 'ra_003',
    text: 'Can you say it slowly, please?',
    textCn: '你能说慢一点吗？',
    keywords: ['slowly', 'please'],
  },
  {
    id: 'ra_004',
    text: "I'd like to check in for my flight.",
    textCn: '我想办理航班值机。',
    keywords: ['check in', 'flight'],
  },
  {
    id: 'ra_005',
    text: 'Where can I find the restroom?',
    textCn: '洗手间在哪里？',
    keywords: ['restroom', 'find'],
  },
  {
    id: 'ra_006',
    text: 'How much does this cost?',
    textCn: '这个多少钱？',
    keywords: ['how much', 'cost'],
  },
  {
    id: 'ra_007',
    text: "I have an appointment at three o'clock.",
    textCn: '我三点有个预约。',
    keywords: ['appointment', "o'clock"],
  },
  {
    id: 'ra_008',
    text: 'Could you write that down for me?',
    textCn: '你能帮我写下来吗？',
    keywords: ['write', 'down'],
  },
  {
    id: 'ra_009',
    text: 'I need to refill my prescription.',
    textCn: '我需要续方。',
    keywords: ['refill', 'prescription'],
  },
  {
    id: 'ra_010',
    text: 'The heater in my room is not working.',
    textCn: '我房间的暖气坏了。',
    keywords: ['heater', 'working'],
  },
];

export const dialogueScenes: DialogueScene[] = [
  {
    id: 'scene_restaurant',
    title: 'At the Restaurant',
    titleCn: '餐厅点餐',
    icon: '🍽️',
    rescueLines: [
      'Please say it slowly.',
      "I don't understand.",
      'Can you write it down?',
      'I only speak a little English.',
    ],
    turns: [
      {
        id: 'r_t1',
        speaker: 'npc',
        npcText: 'Good evening! Welcome to Garden Restaurant. A table for how many?',
        npcTextCn: '晚上好！欢迎来到花园餐厅。几位用餐？',
        options: [
          { id: 'r_t1_a', text: 'Table for two, please.', textCn: '两位，谢谢。', isCorrect: true },
          { id: 'r_t1_b', text: 'I want to eat.', textCn: '我想吃饭。', isCorrect: false },
          { id: 'r_t1_c', text: "I don't know.", textCn: '我不知道。', isCorrect: false },
        ],
      },
      {
        id: 'r_t2',
        speaker: 'npc',
        npcText: "Here's the menu. Are you ready to order?",
        npcTextCn: '这是菜单。您准备好点餐了吗？',
        options: [
          { id: 'r_t2_a', text: "I'd like this one, please.", textCn: '我要这个，谢谢。', isCorrect: true },
          { id: 'r_t2_b', text: 'Give me food.', textCn: '给我吃的。', isCorrect: false },
          { id: 'r_t2_c', text: 'Yes, I am ready.', textCn: '是的，我准备好了。', isCorrect: true },
        ],
      },
      {
        id: 'r_t3',
        speaker: 'npc',
        npcText: "Would you like anything to drink? We have water, juice, and tea.",
        npcTextCn: '您要喝点什么？我们有水、果汁和茶。',
        options: [
          { id: 'r_t3_a', text: "I'd like some tea, please.", textCn: '请给我茶。', isCorrect: true },
          { id: 'r_t3_b', text: 'Water is fine.', textCn: '水就好。', isCorrect: true },
          { id: 'r_t3_c', text: 'No spicy, please.', textCn: '不要辣的。', isCorrect: false },
        ],
      },
      {
        id: 'r_t4',
        speaker: 'npc',
        npcText: "Any food allergies I should know about?",
        npcTextCn: '有什么食物过敏吗？',
        options: [
          { id: 'r_t4_a', text: 'No allergies. Thank you.', textCn: '没有过敏，谢谢。', isCorrect: true },
          { id: 'r_t4_b', text: 'No spicy, please.', textCn: '不要辣的，谢谢。', isCorrect: true },
          { id: 'r_t4_c', text: 'I like food.', textCn: '我喜欢食物。', isCorrect: false },
        ],
      },
      {
        id: 'r_t5',
        speaker: 'npc',
        npcText: "Your food will be ready in about 15 minutes.",
        npcTextCn: '您的餐大约15分钟就好。',
        options: [
          { id: 'r_t5_a', text: 'Thank you very much.', textCn: '非常感谢。', isCorrect: true },
          { id: 'r_t5_b', text: 'OK.', textCn: '好的。', isCorrect: true },
        ],
      },
      {
        id: 'r_t6',
        speaker: 'npc',
        npcText: "Here's your bill. The total is 45 dollars.",
        npcTextCn: '这是您的账单。总共45美元。',
        options: [
          { id: 'r_t6_a', text: 'Can I pay by card?', textCn: '可以刷卡吗？', isCorrect: true },
          { id: 'r_t6_b', text: 'Can I have the bill, please?', textCn: '请给我账单。', isCorrect: false },
          { id: 'r_t6_c', text: "Here's my card.", textCn: '这是我的卡。', isCorrect: true },
        ],
      },
    ],
  },
  {
    id: 'scene_airport',
    title: 'At the Airport',
    titleCn: '机场出行',
    icon: '✈️',
    rescueLines: [
      'Please speak slowly.',
      "I don't understand.",
      'Can you write it down?',
      'Where is gate A12?',
    ],
    turns: [
      {
        id: 'a_t1',
        speaker: 'npc',
        npcText: 'Good morning! May I see your passport and boarding pass?',
        npcTextCn: '早上好！请出示您的护照和登机牌。',
        options: [
          { id: 'a_t1_a', text: "Here's my passport.", textCn: '这是我的护照。', isCorrect: true },
          { id: 'a_t1_b', text: 'Yes.', textCn: '是的。', isCorrect: false },
        ],
      },
      {
        id: 'a_t2',
        speaker: 'npc',
        npcText: 'Are you checking any bags today?',
        npcTextCn: '您今天有托运行李吗？',
        options: [
          { id: 'a_t2_a', text: 'Yes, just this one bag.', textCn: '是的，就这一个包。', isCorrect: true },
          { id: 'a_t2_b', text: 'No, carry-on only.', textCn: '不，只带随身行李。', isCorrect: true },
        ],
      },
      {
        id: 'a_t3',
        speaker: 'npc',
        npcText: "Here's your boarding pass. Your gate is B7. Boarding starts at 2:30.",
        npcTextCn: '这是您的登机牌。登机口是B7。2:30开始登机。',
        options: [
          { id: 'a_t3_a', text: 'Where is gate B7?', textCn: 'B7登机口在哪里？', isCorrect: true },
          { id: 'a_t3_b', text: 'Thank you.', textCn: '谢谢。', isCorrect: true },
        ],
      },
      {
        id: 'a_t4',
        speaker: 'npc',
        npcText: 'Go straight, then turn left. It\'s on your right.',
        npcTextCn: '直走，然后左转。在您的右边。',
        options: [
          { id: 'a_t4_a', text: 'Thank you very much.', textCn: '非常感谢。', isCorrect: true },
          { id: 'a_t4_b', text: 'Can you say that again?', textCn: '你能再说一遍吗？', isCorrect: true },
        ],
      },
    ],
  },
  {
    id: 'scene_pharmacy',
    title: 'At the Pharmacy',
    titleCn: '药房买药',
    icon: '💊',
    rescueLines: [
      'Please say it slowly.',
      "I don't understand.",
      'Can you write it down?',
      'I only speak a little English.',
    ],
    turns: [
      {
        id: 'p_t1',
        speaker: 'npc',
        npcText: 'Hello! How can I help you today?',
        npcTextCn: '你好！有什么可以帮您的？',
        options: [
          { id: 'p_t1_a', text: 'I need some medicine for a headache.', textCn: '我需要头痛药。', isCorrect: true },
          { id: 'p_t1_b', text: 'I have a headache.', textCn: '我头痛。', isCorrect: true },
          { id: 'p_t1_c', text: 'I want to buy.', textCn: '我想买。', isCorrect: false },
        ],
      },
      {
        id: 'p_t2',
        speaker: 'npc',
        npcText: 'Do you have any allergies?',
        npcTextCn: '您有什么过敏吗？',
        options: [
          { id: 'p_t2_a', text: 'No, I don\'t have any allergies.', textCn: '不，我没有过敏。', isCorrect: true },
          { id: 'p_t2_b', text: 'I don\'t know.', textCn: '我不知道。', isCorrect: true },
        ],
      },
      {
        id: 'p_t3',
        speaker: 'npc',
        npcText: 'Take this medicine twice a day, after meals.',
        npcTextCn: '这个药一天两次，饭后服用。',
        options: [
          { id: 'p_t3_a', text: 'How often should I take it?', textCn: '我应该多久吃一次？', isCorrect: false },
          { id: 'p_t3_b', text: 'Twice a day, after meals. Thank you.', textCn: '一天两次，饭后。谢谢。', isCorrect: true },
        ],
      },
      {
        id: 'p_t4',
        speaker: 'npc',
        npcText: 'The total is 12 dollars. Would you like a receipt?',
        npcTextCn: '总共12美元。您需要收据吗？',
        options: [
          { id: 'p_t4_a', text: 'Yes, please. Here\'s my card.', textCn: '好的，请给我收据。这是我的卡。', isCorrect: true },
          { id: 'p_t4_b', text: 'No receipt needed. Thank you.', textCn: '不需要收据，谢谢。', isCorrect: true },
        ],
      },
    ],
  },
  {
    id: 'scene_directions',
    title: 'Asking for Directions',
    titleCn: '问路',
    icon: '🗺️',
    rescueLines: [
      'Please say it slowly.',
      "I don't understand.",
      'Can you show me on the map?',
      'I am lost.',
    ],
    turns: [
      {
        id: 'd_t1',
        speaker: 'npc',
        npcText: 'You look lost. Can I help you?',
        npcTextCn: '你看起来迷路了。需要帮忙吗？',
        options: [
          { id: 'd_t1_a', text: 'Yes, please. Where is the subway station?', textCn: '是的，请问地铁站在哪里？', isCorrect: true },
          { id: 'd_t1_b', text: 'I am lost.', textCn: '我迷路了。', isCorrect: true },
        ],
      },
      {
        id: 'd_t2',
        speaker: 'npc',
        npcText: 'Go straight for two blocks, then turn right. You\'ll see it on your left.',
        npcTextCn: '直走两个街区，然后右转。你会在左边看到它。',
        options: [
          { id: 'd_t2_a', text: 'Thank you very much.', textCn: '非常感谢。', isCorrect: true },
          { id: 'd_t2_b', text: 'Can you say that again, please?', textCn: '你能再说一遍吗？', isCorrect: true },
        ],
      },
    ],
  },
  {
    id: 'scene_supermarket',
    title: 'At the Supermarket',
    titleCn: '超市购物',
    icon: '🛒',
    rescueLines: [
      'Please say it slowly.',
      "I don't understand.",
      'Where can I find...?',
      'Can I return this?',
    ],
    turns: [
      {
        id: 's_t1',
        speaker: 'npc',
        npcText: 'Hi! Can I help you find something?',
        npcTextCn: '你好！需要帮忙找什么吗？',
        options: [
          { id: 's_t1_a', text: 'Where can I find the milk?', textCn: '牛奶在哪里？', isCorrect: true },
          { id: 's_t1_b', text: 'I want milk.', textCn: '我要牛奶。', isCorrect: false },
        ],
      },
      {
        id: 's_t2',
        speaker: 'npc',
        npcText: 'The milk is in aisle 3, on the left side.',
        npcTextCn: '牛奶在第3通道，左手边。',
        options: [
          { id: 's_t2_a', text: 'Thank you.', textCn: '谢谢。', isCorrect: true },
          { id: 's_t2_b', text: 'Where is aisle 3?', textCn: '第3通道在哪里？', isCorrect: true },
        ],
      },
      {
        id: 's_t3',
        speaker: 'npc',
        npcText: 'Your total is 23 dollars and 50 cents.',
        npcTextCn: '总共23美元50美分。',
        options: [
          { id: 's_t3_a', text: 'Can I pay by card?', textCn: '可以刷卡吗？', isCorrect: true },
          { id: 's_t3_b', text: 'Here\'s my card.', textCn: '这是我的卡。', isCorrect: true },
        ],
      },
    ],
  },
];

export const signageItems: SignageItem[] = [
  { id: 'sg_001', keyword: 'Boarding', keywordCn: '登机', category: 'airport', description: 'Boarding gate area where passengers get on the plane.', exampleSentence: 'Boarding starts at 2:30 PM.', icon: '✈️' },
  { id: 'sg_002', keyword: 'Check-in', keywordCn: '值机/登记', category: 'airport', description: 'Where you register and get your boarding pass.', exampleSentence: 'Please go to the check-in counter.', icon: '🛫' },
  { id: 'sg_003', keyword: 'Departure', keywordCn: '出发', category: 'airport', description: 'The area where flights leave from.', exampleSentence: 'Departure is on the second floor.', icon: '🛫' },
  { id: 'sg_004', keyword: 'Arrival', keywordCn: '到达', category: 'airport', description: 'The area where flights arrive.', exampleSentence: 'I will meet you at the arrival hall.', icon: '🛬' },
  { id: 'sg_005', keyword: 'Baggage Claim', keywordCn: '行李提取', category: 'airport', description: 'Where you pick up your luggage after a flight.', exampleSentence: 'Baggage claim is downstairs.', icon: '🧳' },
  { id: 'sg_006', keyword: 'Gate', keywordCn: '登机口', category: 'airport', description: 'The door you go through to board the plane.', exampleSentence: 'My gate is B7.', icon: '🚪' },
  { id: 'sg_007', keyword: 'Emergency Exit', keywordCn: '紧急出口', category: 'airport', description: 'A special door used only in emergencies.', exampleSentence: 'The emergency exit is at the back.', icon: '🚪' },
  { id: 'sg_008', keyword: 'No Smoking', keywordCn: '禁止吸烟', category: 'shop', description: 'Smoking is not allowed in this area.', exampleSentence: 'This is a no smoking area.', icon: '🚭' },
  { id: 'sg_009', keyword: 'Pharmacy', keywordCn: '药房', category: 'hospital', description: 'A shop where you can buy medicine.', exampleSentence: 'The pharmacy is on the first floor.', icon: '💊' },
  { id: 'sg_010', keyword: 'Prescription', keywordCn: '处方', category: 'hospital', description: 'A doctor\'s written order for medicine.', exampleSentence: 'You need a prescription for this medicine.', icon: '📋' },
  { id: 'sg_011', keyword: 'Emergency', keywordCn: '急诊/紧急', category: 'hospital', description: 'For urgent medical problems.', exampleSentence: 'Go to the emergency room.', icon: '🚨' },
  { id: 'sg_012', keyword: 'Receipt', keywordCn: '收据', category: 'shop', description: 'A paper showing what you paid for.', exampleSentence: 'Can I have a receipt, please?', icon: '🧾' },
  { id: 'sg_013', keyword: 'Refund', keywordCn: '退款', category: 'shop', description: 'Getting your money back for a returned item.', exampleSentence: 'I would like a refund, please.', icon: '💰' },
  { id: 'sg_014', keyword: 'Exit', keywordCn: '出口', category: 'transport', description: 'The way out of a building.', exampleSentence: 'The exit is on the left.', icon: '🚪' },
  { id: 'sg_015', keyword: 'Entrance', keywordCn: '入口', category: 'transport', description: 'The way into a building.', exampleSentence: 'The entrance is over there.', icon: '🚪' },
  { id: 'sg_016', keyword: 'Restroom', keywordCn: '洗手间', category: 'shop', description: 'A room with a toilet and sink.', exampleSentence: 'Where is the restroom?', icon: '🚻' },
  { id: 'sg_017', keyword: 'Elevator', keywordCn: '电梯', category: 'transport', description: 'A machine that carries people up and down.', exampleSentence: 'Take the elevator to the third floor.', icon: '🛗' },
  { id: 'sg_018', keyword: 'Escalator', keywordCn: '自动扶梯', category: 'transport', description: 'Moving stairs that carry people up or down.', exampleSentence: 'The escalator is on the right.', icon: '🔼' },
  { id: 'sg_019', keyword: 'Parking', keywordCn: '停车', category: 'transport', description: 'An area where you can leave your car.', exampleSentence: 'Parking is free on Sundays.', icon: '🅿️' },
  { id: 'sg_020', keyword: 'Reservation', keywordCn: '预约/预订', category: 'hotel', description: 'A booking for a table, room, or service.', exampleSentence: 'I have a reservation for 7 PM.', icon: '📅' },
  { id: 'sg_021', keyword: 'Checkout', keywordCn: '退房/结账', category: 'hotel', description: 'Leaving a hotel and paying the bill.', exampleSentence: 'Checkout time is 11 AM.', icon: '🏨' },
  { id: 'sg_022', keyword: 'Lobby', keywordCn: '大厅', category: 'hotel', description: 'The main entrance area of a hotel.', exampleSentence: 'I will wait in the lobby.', icon: '🏨' },
  { id: 'sg_023', keyword: 'Concourse', keywordCn: '大厅/中央通道', category: 'airport', description: 'The main hall in an airport terminal.', exampleSentence: 'The food court is in the main concourse.', icon: '🏬' },
  { id: 'sg_024', keyword: 'Transit', keywordCn: '中转/过境', category: 'airport', description: 'Changing from one flight to another.', exampleSentence: 'I am in transit to London.', icon: '🔄' },
  { id: 'sg_025', keyword: 'Customs', keywordCn: '海关', category: 'airport', description: 'Where officials check your bags when entering a country.', exampleSentence: 'Go through customs after baggage claim.', icon: '🛃' },
];

export const signageQuestions: SignageQuestion[] = signageItems.map((item) => {
  const otherItems = signageItems.filter((s) => s.id !== item.id);
  const wrongOptions = otherItems
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map((s) => s.keywordCn);
  const options = [...wrongOptions, item.keywordCn].sort(() => Math.random() - 0.5);
  return {
    id: `sq_${item.id}`,
    signage: item,
    options,
    correctAnswer: item.keywordCn,
  };
});

export const lessons: Lesson[] = [
  {
    id: 'lesson_read_aloud_1',
    type: 'read_aloud',
    title: 'Daily Expressions',
    titleCn: '日常表达跟读',
    description: '练习最常用的日常英语句子',
    durationSec: 360,
    level: 'A1',
    skills: ['pronunciation', 'speaking'],
  },
  {
    id: 'lesson_read_aloud_2',
    type: 'read_aloud',
    title: 'Travel Phrases',
    titleCn: '旅行用语跟读',
    description: '练习旅行中最常用的英语句子',
    durationSec: 420,
    level: 'A1',
    skills: ['pronunciation', 'speaking'],
    sceneTag: 'travel',
  },
  {
    id: 'lesson_dialogue_restaurant',
    type: 'dialogue',
    title: 'At the Restaurant',
    titleCn: '餐厅点餐对话',
    description: '模拟在餐厅点餐的完整对话',
    durationSec: 480,
    level: 'A1',
    skills: ['speaking', 'listening'],
    sceneTag: 'restaurant',
  },
  {
    id: 'lesson_dialogue_airport',
    type: 'dialogue',
    title: 'At the Airport',
    titleCn: '机场值机对话',
    description: '模拟在机场办理值机的对话',
    durationSec: 420,
    level: 'A1',
    skills: ['speaking', 'listening'],
    sceneTag: 'airport',
  },
  {
    id: 'lesson_dialogue_pharmacy',
    type: 'dialogue',
    title: 'At the Pharmacy',
    titleCn: '药房买药对话',
    description: '模拟在药房买药的对话',
    durationSec: 420,
    level: 'A1',
    skills: ['speaking', 'listening'],
    sceneTag: 'pharmacy',
  },
  {
    id: 'lesson_signage_airport',
    type: 'signage',
    title: 'Airport Signs',
    titleCn: '机场标识识别',
    description: '认识机场最常见的英文标识',
    durationSec: 300,
    level: 'A1',
    skills: ['signage', 'vocab'],
    sceneTag: 'airport',
  },
  {
    id: 'lesson_signage_shop',
    type: 'signage',
    title: 'Shop & Hospital Signs',
    titleCn: '商店与医院标识',
    description: '认识商店和医院的英文标识',
    durationSec: 300,
    level: 'A1',
    skills: ['signage', 'vocab'],
    sceneTag: 'shopping',
  },
  {
    id: 'lesson_signage_transport',
    type: 'signage',
    title: 'Transport & Hotel Signs',
    titleCn: '交通与酒店标识',
    description: '认识交通和酒店的英文标识',
    durationSec: 300,
    level: 'A1',
    skills: ['signage', 'vocab'],
  },
  {
    id: 'lesson_dialogue_directions',
    type: 'dialogue',
    title: 'Asking for Directions',
    titleCn: '问路对话',
    description: '模拟问路的对话',
    durationSec: 360,
    level: 'A1',
    skills: ['speaking', 'listening'],
  },
  {
    id: 'lesson_dialogue_supermarket',
    type: 'dialogue',
    title: 'At the Supermarket',
    titleCn: '超市购物对话',
    description: '模拟在超市购物的对话',
    durationSec: 360,
    level: 'A1',
    skills: ['speaking', 'listening'],
    sceneTag: 'shopping',
  },
];

export const defaultScores: AssessmentScores = {
  vocab: 50,
  signage: 50,
  listening: 50,
  speaking: 50,
  pronunciation: 50,
};

export const milestones: Milestone[] = [
  { id: 'ms_1', title: 'First Lesson', titleCn: '完成第一课', icon: '🎯', achieved: false },
  { id: 'ms_2', title: '3-Day Streak', titleCn: '连续学习3天', icon: '🔥', achieved: false },
  { id: 'ms_3', title: '7-Day Streak', titleCn: '连续学习7天', icon: '⭐', achieved: false },
  { id: 'ms_4', title: '10 Lessons', titleCn: '完成10节课', icon: '📚', achieved: false },
  { id: 'ms_5', title: 'First Dialogue', titleCn: '完成第一个对话', icon: '💬', achieved: false },
  { id: 'ms_6', title: '20 Signages', titleCn: '认识20个标识', icon: '🔤', achieved: false },
  { id: 'ms_7', title: 'Pronunciation Master', titleCn: '发音平均80分', icon: '🎤', achieved: false },
  { id: 'ms_8', title: '30 Lessons', titleCn: '完成30节课', icon: '🏆', achieved: false },
];

export function getTodayLessons(_goalTags: string[]): Lesson[] {
  // Mix different lesson types for a balanced daily plan
  const readAloud = lessons.filter((l) => l.type === 'read_aloud');
  const dialogue = lessons.filter((l) => l.type === 'dialogue');
  const signage = lessons.filter((l) => l.type === 'signage');

  const selected: Lesson[] = [];

  // Pick 1 read-aloud
  if (readAloud.length > 0) {
    selected.push(readAloud[Math.floor(Math.random() * readAloud.length)]);
  }
  // Pick 1 dialogue
  if (dialogue.length > 0) {
    selected.push(dialogue[Math.floor(Math.random() * dialogue.length)]);
  }
  // Pick 1 signage
  if (signage.length > 0) {
    selected.push(signage[Math.floor(Math.random() * signage.length)]);
  }

  return selected;
}

export function getSignageByCategory(category: SignageItem['category']): SignageItem[] {
  return signageItems.filter((s) => s.category === category);
}

export function getDialogueScene(sceneId: string): DialogueScene | undefined {
  return dialogueScenes.find((s) => s.id === sceneId);
}

export function getLessonById(lessonId: string): Lesson | undefined {
  return lessons.find((l) => l.id === lessonId);
}
