import React from 'react';
import { motion } from 'framer-motion';
import PlantStageNew from '../components/PlantStageNew';

const HelpPage = () => {
  const plantStages = [
    {
      stage: 'seed',
      name: 'Seed',
      points: '0 points',
      description: 'Your journey begins! Plant your first seed by writing in your journal.',
      time: 'Start'
    },
    {
      stage: 'sprout',
      name: 'Sprout',
      points: '1-2 points',
      description: 'Your seed sprouts! Keep writing to help it grow.',
      time: '1 day'
    },
    {
      stage: 'plant',
      name: 'Young Plant',
      points: '3-6 points',
      description: 'Your plant is growing strong with multiple leaves.',
      time: '3 days'
    },
    {
      stage: 'blooming',
      name: 'Blooming Plant',
      points: '7-14 points',
      description: 'Beautiful flowers bloom! Your consistent journaling is paying off.',
      time: '1 week'
    },
    {
      stage: 'tree',
      name: 'Mature Tree',
      points: '15-24 points',
      description: 'A strong tree with lush foliage. Your dedication shows!',
      time: '2 weeks'
    },
    {
      stage: 'fruitingTree',
      name: 'Fruiting Tree',
      points: '25+ points',
      description: 'Maximum growth! Abundant fruits represent your journaling mastery.',
      time: '3+ weeks'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage-50 via-earth-50 to-sage-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-gray-900 dark:text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-400 dark:via-emerald-500 dark:to-teal-400 bg-clip-text text-transparent">
            Plant Growth Guide
          </h1>
          <p className="text-xl text-gray-700 dark:text-slate-300 max-w-2xl mx-auto">
            Watch your mood garden flourish as you journal consistently. 
            Each entry earns points that help your plants grow through 6 beautiful stages.
          </p>
        </motion.div>

        {/* How to Earn Points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/80 dark:bg-slate-800/50 backdrop-blur rounded-2xl p-6 mb-12 border border-gray-200 dark:border-slate-700 shadow-lg"
        >
          <h2 className="text-2xl font-semibold mb-4 text-green-600 dark:text-green-400">
            📝 How to Earn Growth Points
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-slate-700/30 rounded-lg p-4 border border-green-100 dark:border-transparent">
              <div className="text-3xl mb-2">✍️</div>
              <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white">Write Journal Entries</h3>
              <p className="text-gray-700 dark:text-slate-300">Each journal entry gives your plant 1 growth point</p>
            </div>
            <div className="bg-blue-50 dark:bg-slate-700/30 rounded-lg p-4 border border-blue-100 dark:border-transparent">
              <div className="text-3xl mb-2">⏱️</div>
              <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white">Focus Sessions</h3>
              <p className="text-gray-700 dark:text-slate-300">Complete focus timer sessions for bonus points</p>
            </div>
            <div className="bg-purple-50 dark:bg-slate-700/30 rounded-lg p-4 border border-purple-100 dark:border-transparent">
              <div className="text-3xl mb-2">🌟</div>
              <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white">Daily Consistency</h3>
              <p className="text-gray-700 dark:text-slate-300">Journal every day to keep your plants healthy</p>
            </div>
            <div className="bg-pink-50 dark:bg-slate-700/30 rounded-lg p-4 border border-pink-100 dark:border-transparent">
              <div className="text-3xl mb-2">💚</div>
              <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white">Quality Matters</h3>
              <p className="text-gray-700 dark:text-slate-300">Longer, thoughtful entries help plants grow faster</p>
            </div>
          </div>
        </motion.div>

        {/* Plant Stages */}
        <div className="space-y-8">
          {plantStages.map((plant, index) => (
            <motion.div
              key={plant.stage}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="bg-white/90 dark:bg-gradient-to-br dark:from-slate-800/80 dark:to-slate-900/80 backdrop-blur rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700 hover:border-green-500/50 dark:hover:border-green-500/50 transition-all duration-300 shadow-xl"
            >
              <div className="grid md:grid-cols-2 gap-6 p-6">
                {/* Plant Visual */}
                <div className="flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 dark:bg-slate-900/50 rounded-xl p-4 border border-green-100 dark:border-transparent">
                  <PlantStageNew stage={plant.stage} visualState="healthy" />
                </div>

                {/* Plant Info */}
                <div className="flex flex-col justify-center space-y-4">
                  {/* Stage Badge */}
                  <div className="flex items-center gap-3">
                    <span className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 px-4 py-1 rounded-full text-sm font-semibold border border-green-200 dark:border-green-500/30">
                      Stage {index + 1}
                    </span>
                    <span className="bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 px-4 py-1 rounded-full text-sm font-semibold border border-blue-200 dark:border-blue-500/30">
                      {plant.time}
                    </span>
                  </div>

                  {/* Plant Name */}
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {plant.name}
                  </h3>

                  {/* Points Required */}
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500 dark:text-yellow-400 text-2xl">⭐</span>
                    <span className="text-xl font-semibold text-yellow-600 dark:text-yellow-400">
                      {plant.points}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 dark:text-slate-300 text-lg leading-relaxed">
                    {plant.description}
                  </p>

                  {/* Progress Indicator */}
                  <div className="pt-4">
                    <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((index + 1) / plantStages.length) * 100}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-12 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-500/10 dark:to-emerald-500/10 backdrop-blur rounded-2xl p-8 border border-green-200 dark:border-green-500/30 shadow-lg"
        >
          <h2 className="text-2xl font-semibold mb-6 text-green-700 dark:text-green-400 flex items-center gap-2">
            <span className="text-3xl">💡</span>
            Pro Tips for a Thriving Garden
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700 dark:text-slate-300">
            <div className="flex gap-3">
              <span className="text-green-600 dark:text-green-400 text-xl flex-shrink-0">✓</span>
              <div>
                <strong className="text-gray-900 dark:text-white">Journal Daily:</strong> Even short entries count! 
                Consistency is key to keeping your plants healthy and growing.
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-green-600 dark:text-green-400 text-xl flex-shrink-0">✓</span>
              <div>
                <strong className="text-gray-900 dark:text-white">Be Authentic:</strong> Write about your true feelings. 
                Your garden reflects your emotional journey.
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-green-600 dark:text-green-400 text-xl flex-shrink-0">✓</span>
              <div>
                <strong className="text-gray-900 dark:text-white">Use Focus Mode:</strong> Complete timed focus sessions 
                to earn extra points and boost plant growth.
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-green-600 dark:text-green-400 text-xl flex-shrink-0">✓</span>
              <div>
                <strong className="text-gray-900 dark:text-white">Watch Them Grow:</strong> Visit your garden page 
                regularly to see your beautiful plants flourish!
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center mt-12 text-gray-600 dark:text-slate-400"
        >
          <p className="text-lg">
            🌱 Remember: Every great garden starts with a single seed. 
            Start your journaling journey today! 🌳
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default HelpPage;
