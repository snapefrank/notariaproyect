import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

const StatCard = ({ title, value, icon, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full border-t-4" style={{ borderTopColor: color }}>
        <CardContent className="p-4 sm:p-6 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-custom-gray">{title}</p>
            <div className="p-2 rounded-full" style={{ backgroundColor: `${color}30` }}> {/* Lighter background for icon */}
              {React.cloneElement(icon, { className: "h-5 w-5 sm:h-6 sm:w-6", style: { color } })}
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-custom-umber mt-1">{value}</h3>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;