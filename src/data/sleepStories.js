// Import additional stories
import { getAllAdditionalStories } from './additionalStories';

// Sleep stories data with 300 stories
export const sleepStories = [
  // Featured Stories
  {
    id: 1,
    title: "The Whispering Forest",
    description: "A walk through a magical, quiet woodland.",
    duration: "15 min",
    image: "/lovable-uploads/whispering-forest.svg",
    category: "featured",
    isPremium: false,
    icon: "🌲"
  },
  {
    id: 2,
    title: "Starlit Dreams",
    description: "Journey through the stars in a peaceful night.",
    duration: "15 min",
    image: "/lovable-uploads/starlit-dreams.svg",
    category: "featured",
    isPremium: false,
    icon: "✨"
  },
  {
    id: 3,
    title: "Ocean Whispers",
    description: "Relax to the gentle sounds of ocean waves.",
    duration: "15 min",
    image: "/lovable-uploads/ocean-whispers.svg",
    category: "short",
    isPremium: false,
    icon: "🌊"
  },
  {
    id: 4,
    title: "Mountain Serenity",
    description: "Find peace in the majestic mountains.",
    duration: "15 min",
    image: "/lovable-uploads/mountain-serenity.svg",
    category: "short",
    isPremium: false,
    icon: "⛰️"
  },
  {
    id: 5,
    title: "Desert Journey",
    description: "A calming trek through peaceful desert landscapes.",
    duration: "30 min",
    image: "/lovable-uploads/desert-journey.svg",
    category: "long",
    isPremium: false,
    icon: "🏜️"
  },
  {
    id: 6,
    title: "Rainforest Adventure",
    description: "Explore the sounds and sensations of a rainforest.",
    duration: "30 min",
    image: "/lovable-uploads/rainforest-adventure.svg",
    category: "long",
    isPremium: false,
    icon: "🌴"
  },
  {
    id: 7,
    title: "The Friendly Dragon",
    description: "A heartwarming tale for parents and children.",
    duration: "20 min",
    image: "/lovable-uploads/friendly-dragon.svg",
    category: "family",
    isPremium: false,
    icon: "🐉"
  },
  {
    id: 8,
    title: "Magical Garden",
    description: "Discover the wonders of a magical garden together.",
    duration: "20 min",
    image: "/lovable-uploads/magical-garden.svg",
    category: "family",
    isPremium: false,
    icon: "🌷"
  },

  // Short Stories (5-15 minutes)
  {
    id: 9,
    title: "Moonlit Meadow",
    description: "A peaceful stroll through a meadow under moonlight.",
    duration: "10 min",
    image: "/lovable-uploads/ocean-whispers.svg",
    category: "short",
    isPremium: false,
    icon: "🌙"
  },
  {
    id: 10,
    title: "Gentle Rain",
    description: "The soothing sounds of rainfall on a quiet evening.",
    duration: "8 min",
    image: "/lovable-uploads/ocean-whispers.svg",
    category: "short",
    isPremium: false,
    icon: "🌧️"
  },
  {
    id: 11,
    title: "Cozy Cabin",
    description: "A warm evening by the fireplace in a mountain cabin.",
    duration: "12 min",
    image: "/lovable-uploads/mountain-serenity.svg",
    category: "short",
    isPremium: false,
    icon: "🏡"
  },
  {
    id: 12,
    title: "Sunset Beach",
    description: "Watching the sun set over calm ocean waters.",
    duration: "9 min",
    image: "/lovable-uploads/ocean-whispers.svg",
    category: "short",
    isPremium: false,
    icon: "🌅"
  },
  {
    id: 13,
    title: "Morning Mist",
    description: "A peaceful walk through a misty morning landscape.",
    duration: "7 min",
    image: "/lovable-uploads/whispering-forest.svg",
    category: "short",
    isPremium: false,
    icon: "🌫️"
  },
  {
    id: 14,
    title: "Butterfly Garden",
    description: "A gentle journey through a garden filled with butterflies.",
    duration: "11 min",
    image: "/lovable-uploads/magical-garden.svg",
    category: "short",
    isPremium: false,
    icon: "🦋"
  },
  {
    id: 15,
    title: "Quiet Library",
    description: "The peaceful ambiance of an old library at night.",
    duration: "14 min",
    image: "/lovable-uploads/starlit-dreams.svg",
    category: "short",
    isPremium: true,
    icon: "📚"
  },
  {
    id: 16,
    title: "Floating Clouds",
    description: "Drifting peacefully among soft, fluffy clouds.",
    duration: "6 min",
    image: "/lovable-uploads/starlit-dreams.svg",
    category: "short",
    isPremium: false,
    icon: "☁️"
  },
  {
    id: 17,
    title: "Autumn Leaves",
    description: "A calming walk through a forest of falling autumn leaves.",
    duration: "13 min",
    image: "/lovable-uploads/whispering-forest.svg",
    category: "short",
    isPremium: true,
    icon: "🍂"
  },
  {
    id: 18,
    title: "Gentle Stream",
    description: "Following the path of a peaceful forest stream.",
    duration: "10 min",
    image: "/lovable-uploads/whispering-forest.svg",
    category: "short",
    isPremium: false,
    icon: "🏞️"
  },
  {
    id: 19,
    title: "Snowy Evening",
    description: "A quiet night walk through gently falling snow.",
    duration: "15 min",
    image: "/lovable-uploads/mountain-serenity.svg",
    category: "short",
    isPremium: true,
    icon: "❄️"
  },
  {
    id: 20,
    title: "City Lights",
    description: "A peaceful nighttime view of distant city lights.",
    duration: "8 min",
    image: "/lovable-uploads/starlit-dreams.svg",
    category: "short",
    isPremium: false,
    icon: "🌃"
  },
  {
    id: 21,
    title: "Garden Pond",
    description: "Sitting beside a tranquil pond in a Japanese garden.",
    duration: "12 min",
    image: "/lovable-uploads/magical-garden.svg",
    category: "short",
    isPremium: true,
    icon: "🏯"
  },
  {
    id: 22,
    title: "Lighthouse Bay",
    description: "Watching waves from an old lighthouse on a quiet bay.",
    duration: "9 min",
    image: "/lovable-uploads/ocean-whispers.svg",
    category: "short",
    isPremium: false,
    icon: "🏝️"
  },
  {
    id: 23,
    title: "Lavender Fields",
    description: "A gentle breeze through endless fields of lavender.",
    duration: "11 min",
    image: "/lovable-uploads/magical-garden.svg",
    category: "short",
    isPremium: true,
    icon: "💜"
  },
  {
    id: 24,
    title: "Quiet Bookshop",
    description: "Browsing shelves in a cozy, quiet bookshop after hours.",
    duration: "7 min",
    image: "/lovable-uploads/starlit-dreams.svg",
    category: "short",
    isPremium: false,
    icon: "📖"
  },

  // Long Stories (20-30 minutes)
  {
    id: 25,
    title: "Journey to the Stars",
    description: "A peaceful voyage through the cosmos and distant galaxies.",
    duration: "25 min",
    image: "/lovable-uploads/starlit-dreams.svg",
    category: "long",
    isPremium: false,
    icon: "🌠"
  },
  {
    id: 26,
    title: "Ancient Forest",
    description: "Exploring the depths of an ancient, magical forest.",
    duration: "28 min",
    image: "/lovable-uploads/whispering-forest.svg",
    category: "long",
    isPremium: true,
    icon: "🌳"
  },
  {
    id: 27,
    title: "Ocean Depths",
    description: "A calming journey to the peaceful depths of the ocean.",
    duration: "22 min",
    image: "/lovable-uploads/ocean-whispers.svg",
    category: "long",
    isPremium: false,
    icon: "🐠"
  },
  {
    id: 28,
    title: "Mountain Cabin",
    description: "A cozy evening in a remote mountain cabin during snowfall.",
    duration: "26 min",
    image: "/lovable-uploads/mountain-serenity.svg",
    category: "long",
    isPremium: true,
    icon: "🏔️"
  },
  {
    id: 29,
    title: "Tropical Island",
    description: "Relaxing on a secluded beach on a tropical island.",
    duration: "24 min",
    image: "/lovable-uploads/ocean-whispers.svg",
    category: "long",
    isPremium: false,
    icon: "🏝️"
  },
  {
    id: 30,
    title: "Enchanted Castle",
    description: "Exploring the quiet halls of an ancient, magical castle.",
    duration: "30 min",
    image: "/lovable-uploads/starlit-dreams.svg",
    category: "long",
    isPremium: true,
    icon: "🏰"
  },
  {
    id: 31,
    title: "Countryside Train",
    description: "A peaceful train journey through rolling countryside.",
    duration: "27 min",
    image: "/lovable-uploads/mountain-serenity.svg",
    category: "long",
    isPremium: false,
    icon: "🚂"
  },
  {
    id: 32,
    title: "Floating Lanterns",
    description: "A night of floating lanterns over a peaceful lake.",
    duration: "23 min",
    image: "/lovable-uploads/starlit-dreams.svg",
    category: "long",
    isPremium: true,
    icon: "🏮"
  },
  {
    id: 33,
    title: "Secret Garden",
    description: "Discovering a hidden, magical garden behind ancient walls.",
    duration: "29 min",
    image: "/lovable-uploads/magical-garden.svg",
    category: "long",
    isPremium: false,
    icon: "🌺"
  },
  {
    id: 34,
    title: "Northern Lights",
    description: "Watching the aurora borealis dance across the night sky.",
    duration: "25 min",
    image: "/lovable-uploads/starlit-dreams.svg",
    category: "long",
    isPremium: true,
    icon: "✨"
  },
  {
    id: 35,
    title: "Bamboo Forest",
    description: "A gentle walk through a peaceful bamboo forest.",
    duration: "21 min",
    image: "/lovable-uploads/whispering-forest.svg",
    category: "long",
    isPremium: false,
    icon: "🎋"
  },
  {
    id: 36,
    title: "Sailing Adventure",
    description: "A peaceful sailing journey across a calm, moonlit sea.",
    duration: "28 min",
    image: "/lovable-uploads/ocean-whispers.svg",
    category: "long",
    isPremium: true,
    icon: "⛵"
  },
  {
    id: 37,
    title: "Misty Mountains",
    description: "Hiking through misty mountain peaks at dawn.",
    duration: "24 min",
    image: "/lovable-uploads/mountain-serenity.svg",
    category: "long",
    isPremium: false,
    icon: "🏞️"
  },
  {
    id: 38,
    title: "Flower Valley",
    description: "A journey through a valley filled with wildflowers.",
    duration: "26 min",
    image: "/lovable-uploads/magical-garden.svg",
    category: "long",
    isPremium: true,
    icon: "🌸"
  },

  // Family Stories
  {
    id: 39,
    title: "The Sleepy Dragon",
    description: "A gentle tale about a dragon who can't fall asleep.",
    duration: "18 min",
    image: "/lovable-uploads/friendly-dragon.svg",
    category: "family",
    isPremium: false,
    icon: "🐲"
  },
  {
    id: 40,
    title: "Moonlight Friends",
    description: "Animals who become friends during a magical moonlit night.",
    duration: "15 min",
    image: "/lovable-uploads/friendly-dragon.svg",
    category: "family",
    isPremium: true,
    icon: "🦊"
  },
  {
    id: 41,
    title: "The Brave Little Boat",
    description: "A small boat's adventure across a friendly ocean.",
    duration: "12 min",
    image: "/lovable-uploads/ocean-whispers.svg",
    category: "family",
    isPremium: false,
    icon: "🚢"
  },
  {
    id: 42,
    title: "Cloud Castle",
    description: "A journey to a magical castle floating among the clouds.",
    duration: "20 min",
    image: "/lovable-uploads/starlit-dreams.svg",
    category: "family",
    isPremium: true,
    icon: "☁️"
  },
  {
    id: 43,
    title: "The Talking Tree",
    description: "A wise old tree who shares stories with forest animals.",
    duration: "16 min",
    image: "/lovable-uploads/whispering-forest.svg",
    category: "family",
    isPremium: false,
    icon: "🌳"
  },
  {
    id: 44,
    title: "Star Friends",
    description: "A child who makes friends with the stars in the night sky.",
    duration: "14 min",
    image: "/lovable-uploads/starlit-dreams.svg",
    category: "family",
    isPremium: true,
    icon: "⭐"
  },
  {
    id: 45,
    title: "The Gentle Giant",
    description: "A friendly giant who helps the creatures of the forest.",
    duration: "19 min",
    image: "/lovable-uploads/friendly-dragon.svg",
    category: "family",
    isPremium: false,
    icon: "🧙‍♂️"
  },
  {
    id: 46,
    title: "Underwater Friends",
    description: "A journey beneath the waves to meet friendly sea creatures.",
    duration: "17 min",
    image: "/lovable-uploads/ocean-whispers.svg",
    category: "family",
    isPremium: true,
    icon: "🐙"
  },
  {
    id: 47,
    title: "The Magic Paintbrush",
    description: "A child with a paintbrush that brings drawings to life.",
    duration: "13 min",
    image: "/lovable-uploads/magical-garden.svg",
    category: "family",
    isPremium: false,
    icon: "🖌️"
  },
  {
    id: 48,
    title: "Bedtime for Bear",
    description: "A little bear who learns the importance of a good night's sleep.",
    duration: "11 min",
    image: "/lovable-uploads/friendly-dragon.svg",
    category: "family",
    isPremium: true,
    icon: "🐻"
  },

  // Additional stories to reach 200
  // Featured Stories (continued)
  {
    id: 49,
    title: "Peaceful Meadow",
    description: "A serene walk through a flower-filled meadow.",
    duration: "18 min",
    image: "/lovable-uploads/magical-garden.svg",
    category: "featured",
    isPremium: false,
    icon: "🌼"
  },
  {
    id: 50,
    title: "Twilight Lake",
    description: "Watching the sunset over a tranquil mountain lake.",
    duration: "20 min",
    image: "/lovable-uploads/mountain-serenity.svg",
    category: "featured",
    isPremium: true,
    icon: "🌅"
  },

  // Generate more stories to reach 200
  ...Array.from({ length: 150 }, (_, i) => {
    const id = i + 51;
    const categories = ["short", "long", "family", "featured"];
    const category = categories[Math.floor(Math.random() * categories.length)];

    const shortTitles = [
      "Moonlit Path", "Gentle Waves", "Forest Whispers", "Starry Night",
      "Mountain Echo", "Quiet Stream", "Evening Breeze", "Morning Dew",
      "Peaceful Garden", "Sunset Beach", "Quiet Snowfall", "Autumn Leaves",
      "Spring Blossoms", "Summer Meadow", "Winter Cabin", "Rainy Day",
      "Ocean Breeze", "Desert Night", "Lakeside Morning", "Foggy Valley"
    ];

    const longTitles = [
      "Journey Through Time", "Celestial Voyage", "Ancient Forest Tales",
      "Ocean's Deep Secrets", "Mountain Sanctuary", "Island Paradise",
      "Enchanted Castle Dreams", "Countryside Memories", "Mystical Garden",
      "Northern Lights Wonder", "Bamboo Forest Serenity", "Sailing the Stars"
    ];

    const familyTitles = [
      "The Friendly Cloud", "Moon and Stars Friends", "The Brave Little Fish",
      "Sky Castle Adventure", "The Wise Old Oak", "Starlight Companions",
      "The Kind Mountain", "Underwater Kingdom", "The Magic Paintbrush",
      "Bedtime for Bunny", "The Sleepy Owl", "The Lost Star"
    ];

    const icons = ["🌙", "✨", "🌲", "🌊", "⛰️", "🏜️", "🌴", "🐉", "🌷", "🦋", "🌅", "🌫️", "🏡", "☁️", "🍂", "❄️", "🌃", "🏯", "🏝️", "💜", "📖", "🌠", "🌳", "🐠", "🏔️", "🏰", "🚂", "🏮", "🌺", "🎋", "⛵", "🏞️", "🌸", "🐲", "🦊", "🚢", "🧙‍♂️", "🐙", "🖌️", "🐻", "🌼"];

    let title, description, duration, icon;

    if (category === "short") {
      title = shortTitles[Math.floor(Math.random() * shortTitles.length)];
      description = "A peaceful journey to help you relax and drift to sleep.";
      duration = `${5 + Math.floor(Math.random() * 10)} min`;
    } else if (category === "long") {
      title = longTitles[Math.floor(Math.random() * longTitles.length)];
      description = "A longer story to guide you into deep, restful sleep.";
      duration = `${20 + Math.floor(Math.random() * 10)} min`;
    } else if (category === "family") {
      title = familyTitles[Math.floor(Math.random() * familyTitles.length)];
      description = "A gentle tale for parents and children to enjoy together.";
      duration = `${10 + Math.floor(Math.random() * 10)} min`;
    } else {
      title = shortTitles[Math.floor(Math.random() * shortTitles.length)];
      description = "A featured story to help you find peaceful sleep.";
      duration = `${15 + Math.floor(Math.random() * 15)} min`;
    }

    icon = icons[Math.floor(Math.random() * icons.length)];

    // Determine if premium (about 30% of stories are premium)
    const isPremium = Math.random() < 0.3;

    // Determine image based on category
    let image;
    if (category === "short") {
      image = "/lovable-uploads/ocean-whispers.svg";
    } else if (category === "long") {
      image = "/lovable-uploads/mountain-serenity.svg";
    } else if (category === "family") {
      image = "/lovable-uploads/friendly-dragon.svg";
    } else {
      image = "/lovable-uploads/starlit-dreams.svg";
    }

    return {
      id,
      title: `${title} ${id - 50}`,
      description,
      duration,
      image,
      category,
      isPremium,
      icon
    };
  }),

  // Add the 100 additional stories
  ...getAllAdditionalStories()
];

// Function to get stories by category
export const getStoriesByCategory = (category) => {
  return sleepStories.filter(story => story.category === category);
};

// Function to get all stories
export const getAllStories = () => {
  return sleepStories;
};

// Function to get premium stories
export const getPremiumStories = () => {
  return sleepStories.filter(story => story.isPremium);
};

// Function to get free stories
export const getFreeStories = () => {
  return sleepStories.filter(story => !story.isPremium);
};
