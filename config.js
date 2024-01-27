module.exports = {
    whiteList : ["ompatil","mayurhiwale"],
    authKey : process.env.AUTH_KEY,
    subjects : {
        bis: "Business Intelligence System",
        cns: "Cryptography Network Security",
        dt: "Design Thinking",
        nlp: "Natural Language Processing",
        misc: "Miscellaneous"
      },
    
    fileDeleteDelay : 300, // 2 minutes

    hasAccess: function(authKey,username) {
        console.log(this.authKey);
        if(authKey !== this.authKey) return false;
        if(!this.whiteList.includes(Tools.toId(username))) return false;
        return true;
    }
}