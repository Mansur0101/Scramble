let app = new Vue({
  el: '#app',
  data: {
      game: {
          guess: "",
          words: ["Fruits", "Simba", "Object", "Programming", "Screen"],
          points : 0,
          strikes : 0,
          scrambledWord: "",
          wordNotScrumbled : "",
          pickedIndex: 0,
          passes: 3,
          isVisible: false,
          playAgainVisible: false,
          messageBody: "",
          alertClass: "",
          disabled: 0,
          won: false,
          lost: false
    },
    },
    mounted(){
      if( localStorage.getItem("scrumble") ){
        this.game = JSON.parse( localStorage.getItem("scrumble") ); //this.game = JSON.parse(localStorage.getItem("scrumble"));
      }else{
        this.generateNewWord();
      }
    },
  watch:  {
    'game.points': function (newVal){
      if(newVal >=  3 && this.game.words.length < 1 ) {
        this.wonGame();
      }
    },
    'game.strikes': function (newVal){
      if( newVal >= 3 ){
        this.lostGame();
      }
    }
  },
  methods: {
      lostGame: function(){
        this.lost = true;
        this.game.messageBody = "😭😭Sorry😭😭 you lost the game! Try again!";
        this.isVisible = true;
      }, 
      wonGame: function () {
        this.won = true;
        this.game.messageBody = "🌟🌟Congratulations🌟🌟 you won the game! Want to try again ? ";
        this.isVisible = true;
      },
      passWord: function ( ) {
        if ( this.game.passes < 1 ){
          alert("You can't pass anymore !");
          return;
        }
        else{
          this.game.passes--;
          this.game.words.splice(this.game.pickedIndex, 1);
          this.generateNewWord(); 
        }
      },
      initGameState: function (  ){
        let game = {
          guess: "",
          words: ["Fruits", "Simba", "Object", "Programming", "Screen"],
          points : 0,
          strikes : 0,
          scrambledWord: "",
          wordNotScrumbled : "",
          pickedIndex: 0,
          passes: 3,
          isVisible: false,
          playAgainVisible: false,
          messageBody: "",
          alertClass: "",
          disabled: 0,
          won: false
        }
        this.game = game;
      },
      playAgain: function ( ) {
        localStorage.removeItem("scrumble");
        this.initGameState();
        this.generateNewWord();
      },
      updateStorage: function(  ) {
        localStorage.setItem("scrumble", JSON.stringify(this.game));
      },
      generateNewWord: function(  ) {
        this.game.pickedIndex = this.pickRandomWordsIndex( this.game.words );
        this.game.wordNotScrumbled = this.game.words[this.game.pickedIndex];
        this.game.scrambledWord = this.shuffle( this.game.words[this.game.pickedIndex] ).toLowerCase();
        this.updateStorage();
      },
      pickRandomWordsIndex: function( array ) {
        let indexOfWord = Math.floor(Math.random() * array.length);
        return indexOfWord;
      },
      shuffle : function( src ) {
        const copy = [...src]
        const length = copy.length
        for (let i = 0; i < length; i++) {
          const x = copy[i]
          const y = Math.floor(Math.random() * length)
          const z = copy[y]
          copy[i] = z
          copy[y] = x
        }
        if (typeof src === 'string') {
          return copy.join('')
        }  
        return copy
      },
      guessWord: function() {
        if( this.game.strikes < 3 ){
          if( this.game.guess.toLowerCase().trim() === this.game.wordNotScrumbled.toLowerCase() ){
            this.game.points++;
            this.game.messageBody = "Correct you have guessed it, Next!"
            this.game.alertClass = "alert alert-primary"
            this.game.isVisible = true;
            setTimeout(function () { app.$data.game.isVisible = false; }, 5000)
            this.game.words.splice(this.game.pickedIndex, 1);
            this.game.guess = ""
            this.updateStorage();
            if(this.game.words.length > 0) {
              this.generateNewWord();
            }
            else {
              this.game.playAgainVisible = true;
              this.game.disabled = 1;
            }
          } else if ( this.game.strikes <= 3 ) {
            this.game.strikes++;
            this.updateStorage();
            this.game.messageBody = "Wrong! Give it another shot.";
            this.game.isVisible = true;
            this.game.alertClass = "alert alert-danger";
            setTimeout(function () { app.$data.game.isVisible = false }, 5000);
            this.updateStorage();
        }
      }
      else{
        this.game.playAgainVisible = true;
        this.game.disabled = 1; 
        this.updateStorage();
      }
    }
  }
});
