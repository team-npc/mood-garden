import React from 'react';
import { motion } from 'framer-motion';
import PlantStageNew from '../components/PlantStageNew';
import { Pencil, Timer, Sparkles, Heart, ArrowRight } from 'lucide-react';

const HelpPage = () => {
  const plantStages = [
    { stage: 'seed', name: 'Seed', description: 'The beginning of your journey' },
    { stage: 'sprout', name: 'Sprout', description: 'Your first roots are forming' },
    { stage: 'plant', name: 'Young Plant', description: 'Growing stronger each day' },
    { stage: 'blooming', name: 'Blooming', description: 'Your practice is flourishing' },
    { stage: 'tree', name: 'Mature Tree', description: 'Deep roots, strong branches' },
    { stage: 'fruitingTree', name: 'Fruiting Tree', description: 'Sharing your growth with the world' }
  ];

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-deep-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sage-100/50 to-leaf-100/30 dark:from-deep-800 dark:to-deep-900" />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left - Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-earth-800 dark:text-cream-100 leading-tight mb-6">
                Grow your
                <span className="text-leaf-600 dark:text-leaf-400"> mindful </span>
                garden
              </h1>
              <p className="text-lg text-earth-600 dark:text-cream-400 mb-8 max-w-md">
                Journal at your own pace to watch your plants flourish. Every thought you plant helps your garden grow naturally.
              </p>
              
              {/* Philosophy Row */}
              <div className="flex flex-wrap gap-6">
                <div className="text-center">
                  <div className="text-3xl mb-1">🌱</div>
                  <div className="text-sm text-earth-500 dark:text-cream-500">Natural Growth</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-1">🌿</div>
                  <div className="text-sm text-earth-500 dark:text-cream-500">Your Own Pace</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-1">💚</div>
                  <div className="text-sm text-earth-500 dark:text-cream-500">No Pressure</div>
                </div>
              </div>
            </motion.div>
            
            {/* Right - Featured Plants Grid */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="bg-white/80 dark:bg-deep-800/50 rounded-3xl p-6 flex items-center justify-center aspect-square">
                <PlantStageNew stage="blooming" visualState="healthy" />
              </div>
              <div className="bg-sage-100/50 dark:bg-sage-900/20 rounded-3xl p-6 flex items-center justify-center aspect-square">
                <PlantStageNew stage="tree" visualState="healthy" />
              </div>
              <div className="col-span-2 bg-leaf-100/30 dark:bg-leaf-900/20 rounded-3xl p-6 flex items-center justify-center h-40">
                <PlantStageNew stage="fruitingTree" visualState="healthy" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How Plants Grow - Simple Icons Row */}
      <section className="py-12 border-y border-earth-200/50 dark:border-deep-700/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: '✍️', title: 'Write Freely', sub: 'Express yourself' },
              { icon: '🌱', title: 'Watch Growth', sub: 'Natural progress' },
              { icon: '🌟', title: 'Feel Good', sub: 'No pressure' },
              { icon: '💚', title: 'Enjoy the Journey', sub: 'At your pace' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * i }}
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="font-semibold text-earth-800 dark:text-cream-100">{item.title}</div>
                <div className="text-sm text-earth-500 dark:text-cream-500">{item.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Growth Stages - Timeline Layout */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-earth-800 dark:text-cream-100 mb-2">
              Your Growth Journey
            </h2>
            <p className="text-earth-600 dark:text-cream-400">
              Watch your plants evolve naturally as you write
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line connector */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-earth-300 via-sage-400 to-leaf-500 dark:from-earth-600 dark:via-sage-600 dark:to-leaf-600 hidden md:block transform -translate-x-1/2" />
            
            <div className="space-y-12">
              {plantStages.map((plant, index) => (
                <motion.div
                  key={plant.stage}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className={`flex flex-col md:flex-row items-center gap-6 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Plant Visual */}
                  <div className="flex-1 flex justify-center md:justify-end">
                    <div className={`bg-white/60 dark:bg-deep-800/40 rounded-2xl p-6 ${index % 2 === 1 ? 'md:ml-8' : 'md:mr-8'}`}>
                      <PlantStageNew stage={plant.stage} visualState="healthy" />
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="hidden md:flex w-5 h-5 rounded-full bg-leaf-500 dark:bg-leaf-400 border-4 border-cream-50 dark:border-deep-900 shadow-lg z-10 flex-shrink-0" />

                  {/* Plant Info */}
                  <div className={`flex-1 text-center md:text-left ${index % 2 === 1 ? 'md:text-right' : ''}`}>
                    <h3 className="text-2xl font-bold text-earth-800 dark:text-cream-100 mb-2">
                      {plant.name}
                    </h3>
                    
                    <p className="text-earth-600 dark:text-cream-400 text-sm">
                      {plant.description}
                    </p>
                    
                    {/* Visual growth indicator */}
                    <div className={`mt-3 flex gap-1 justify-center ${index % 2 === 1 ? 'md:justify-end' : 'md:justify-start'}`}>
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-full ${i <= index ? 'bg-leaf-500' : 'bg-earth-200 dark:bg-deep-700'}`}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tips Section - Clean Cards */}
      <section className="py-16 bg-gradient-to-b from-sage-50/50 to-transparent dark:from-deep-800/30 dark:to-transparent">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl font-bold text-earth-800 dark:text-cream-100 mb-2">
              Tips for Success
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {[
              { title: 'Start Small', desc: 'Even a few sentences count as an entry' },
              { title: 'Be Honest', desc: 'Your garden reflects your true journey' },
              { title: 'Stay Consistent', desc: 'Daily entries keep plants thriving' },
              { title: 'Enjoy the Process', desc: 'Growth takes time - be patient' }
            ].map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * i }}
                className="flex items-start gap-3 p-4"
              >
                <span className="text-leaf-500 dark:text-leaf-400 mt-0.5">✓</span>
                <div>
                  <div className="font-medium text-earth-800 dark:text-cream-100">{tip.title}</div>
                  <div className="text-sm text-earth-600 dark:text-cream-400">{tip.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-earth-600 dark:text-cream-400"
        >
          🌱 Every great garden starts with a single seed 🌳
        </motion.p>
      </section>
    </div>
  );
};

export default HelpPage;
