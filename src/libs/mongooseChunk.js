export default async function mongooseChunk(chunkSize, callback, Model, conditions = {}, projections = '', options = {}){
  const documentsCount = await Model.countDocuments(conditions);

  for(let i = 0; i < documentsCount; i += chunkSize){
    const chunk = await Model.find(conditions, projections, {
      ...options,
      limit: chunkSize,
      skip: i
    });

    try{
      const result = callback(chunk);
      if(result instanceof Promise){
        await result;
      }
    }catch (e){
      return;
    }

  }
}