"use client"

import { motion } from "framer-motion"

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
}

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

export const FadeIn = ({ children, delay = 0, ...props }: any) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.6, delay } },
    }}
    {...props}
  >
    {children}
  </motion.div>
)

export const FadeInUp = ({ children, delay = 0, ...props }: any) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay } },
    }}
    {...props}
  >
    {children}
  </motion.div>
)

export const StaggerChildren = ({ children, ...props }: any) => (
  <motion.div initial="hidden" animate="visible" variants={staggerContainer} {...props}>
    {children}
  </motion.div>
)

export const StaggerItem = ({ children, ...props }: any) => (
  <motion.div variants={fadeInUp} {...props}>
    {children}
  </motion.div>
)
