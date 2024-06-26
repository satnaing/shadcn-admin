const getDate = (date: Date): string => {
    const myDate = new Date(date);
    const now = new Date();
    const differenceInSeconds = Math.floor((myDate.getTime() - now.getTime()) / 1000);
  
    // condition if date is in the past
    if (differenceInSeconds < 0) {
      const absDifferenceInSeconds = Math.abs(differenceInSeconds);
      if (absDifferenceInSeconds < 60) {
        return `${absDifferenceInSeconds} seconds ago`;
      }
  
      const absDifferenceInMinutes = Math.floor(absDifferenceInSeconds / 60);
      if (absDifferenceInMinutes < 60) {
        return `${absDifferenceInMinutes} minutes ago`;
      }
  
      const absDifferenceInHours = Math.floor(absDifferenceInMinutes / 60);
      if (absDifferenceInHours < 24) {
        return `${absDifferenceInHours} hours ago`;
      }
  
      return myDate.toLocaleDateString();
  
      // conditions if date is in future 
    } else {
      if (differenceInSeconds < 60) {
        return `in ${differenceInSeconds} seconds`;
      }
  
      const differenceInMinutes = Math.floor(differenceInSeconds / 60);
      if (differenceInMinutes < 60) {
        return `in ${differenceInMinutes} minutes`;
      }
  
      const differenceInHours = Math.floor(differenceInMinutes / 60);
      if (differenceInHours < 24) {
        return `in ${differenceInHours} hours`;
      }
  
      //return expires on date
      return `${myDate.toLocaleDateString()}`;
    }
  };
  
  export { getDate };