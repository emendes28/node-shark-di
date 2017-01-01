
const assert = require('assert');
const RSVP = require('rsvp');
const Promise = RSVP.Promise;
const di = require('../index');
const Module = di.Module;
const Container = di.Container;


describe('shark-di tests', function(){


   this.timeout(100);

   it('should resolve bind factory', function(done){
   


      var mainModule = new Module();

      mainModule.bind('dice', function(){
          return  function(){ return 10; };
      });

      mainModule.bind('game', function(dice){
      
          return function(){
              return dice()*10; 
          }
      });
   
      var container = new Container();

      container.load([mainModule]);


      container.get(function(err, game){
      
          try{
             assert.equal(100, game());
             done();
          }
          catch(ex){
          
             done(ex);
          }
      });


   });


   it('should resolve promise based factory', function(done){
   

      var mainModule = new Module();

      mainModule.bind('dice', function(){

          var dice = function(){
             return 10; 
          }

          return new Promise(function(resolve, reject){
              resolve(dice);
          });
          
      });

      mainModule.bind('game', function(dice){
      
          return function(){
              return dice()*10; 
          }

      });
   
      var container = new Container();

      container.load([mainModule]);


      container.get(function(err, game){
      
          try{
             assert.equal(100, game());
             done();
          }
          catch(ex){
          
             done(ex);
          }
      });


   })



   it('should fill "err" parameter when factory throws an exception.', function(done){
   

      var mainModule = new Module();

      mainModule.bind('dice', function(){
         throw new Error('Error at creating dice.');
      });

      mainModule.bind('game', function(dice){
      
          return function(){
              return dice()*10; 
          }
      });
   
      var container = new Container();

      container.load([mainModule]);


      container.get(function(err, game){
      
         try{
          assert.ok(err);
          assert.ok(err instanceof Error);
          assert.equal(err.message, 'Error at creating dice.');
          done();
         }
         catch(ex){
            done(ex);
         }

      });


   });


   it('should fill "err" parameter when promised reject.', function(done){
   

      var mainModule = new Module();

      mainModule.bind('dice', function(){
         return new Promise(function(resolve, reject){
              reject(new Error('Error at creating dice.'));
         });
      });

      mainModule.bind('game', function(dice){
      
          return function(){
              return dice()*10; 
          }
      });
   
      var container = new Container();

      container.load([mainModule]);


      container.get(function(err, game){
      
         try{
          assert.ok(err);
          assert.ok(err instanceof Error);
          assert.equal(err.message, 'Error at creating dice.');
          done();
         
         }
         catch(ex){
            done(ex);
         }

      });


   });


   it('should resolve bind to a class (constructor)', function(done){
   

      var mainModule = new Module();

      mainModule.bind('dice', function(){

          var dice = function(){
             return 10; 
          }

          return dice;
          
      });

      var gameClass = function(dice){
      
          this.dice = dice;
          this.play = function(){
              return this.dice()*10; 
          };

      };

      mainModule.bindClass('game', gameClass);
   
      var container = new Container();

      container.load([mainModule]);


      container.get(function(err, game){
      
          try{
             assert.equal(100, game.play());
             assert.ok(game instanceof gameClass);
             assert.ok(game.constructor === gameClass);
             done();
          }
          catch(ex){
          
             done(ex);
          }
      });


   })

});


