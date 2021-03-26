let _maxMemoryConsumption: number = process.memoryUsage().rss;
let _dtOfMaxMemoryConsumption: Date = new Date();

process.nextTick(() => {
  const memUsage = process.memoryUsage();
  if (memUsage.rss > _maxMemoryConsumption) {
    _maxMemoryConsumption = memUsage.rss;
    _dtOfMaxMemoryConsumption = new Date();
  }
});

process.on('exit', () => {
  console.log(`Max memory consumption: ${_maxMemoryConsumption} at ${_dtOfMaxMemoryConsumption}`);
});
