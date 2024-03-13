import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';

const Balloon = ({ onPress, color }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={[styles.balloon, { backgroundColor: color }]} />
  </TouchableOpacity>
);


export default function App() {
  const [timeLeft, setTimeLeft] = useState(60); // 2 minutes
  const [score, setScore] = useState(0);
  const [balloons, setBalloons] = useState(['red', 'blue', 'green', 'yellow']);
  const [isGameStarted, setIsGameStarted] = useState(false)

  // Timer
  useEffect(() => {
    let interval = null;
    if (isGameStarted) {
      interval = setInterval(() => {
        if (timeLeft > 0) {
          setTimeLeft((timeLeft) => timeLeft - 1);
        } else {
          clearInterval(interval);
          setIsGameStarted(false);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }


    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [isGameStarted, timeLeft]);

  // Generate random balloon
  useEffect(() => {
    const balloonInterval = setInterval(() => {
      const newBalloon = ['red','blue','green', 'yellow',]
      // Add the new balloon to the array of balloons
      setBalloons((prevBalloons) => [...prevBalloons, ...newBalloon]);

      // Remove balloons after 5 seconds
      setTimeout(() => {
        setBalloons(prevBalloons => prevBalloons.slice(1));
      }, 5000);
    }, 2000); // Add a new balloon every 2 seconds

    // Clean up interval on unmount
    return () => clearInterval(balloonInterval);
  }, [isGameStarted]);

  // Pop a balloon
  const popBalloon = (index) => {
    setScore(score + 2);
    setBalloons((prevBalloons) => {
      prevBalloons.splice(index, 1);
      return [...prevBalloons];
    });
  };

  // Miss a balloon
  const missBalloon = () => {
    if(isGameStarted){
      setScore(score - 1);
    }
  };

  const handleStartGame = () => {
    setIsGameStarted(true)
  }
  const handleResetStartGame = () => {
    setIsGameStarted(false);
    setTimeLeft(120)
    setScore(0)
    setBalloons(['red', 'blue', 'green', 'yellow'])
  }

  return (
    <View style={styles.container}>
      {/* header of the app that displays the title */}
      <View style={styles.header}>
        <Text style={styles.title}>Pop the <Text style={styles.whiteText}>Balloons</Text></Text>
      </View>

      {/* displays the timer */}
      <View style={styles.timer}>
        <Text style={styles.subTitle}>Timer: {timeLeft}s</Text>
      </View>

      {/* the game area, where balloons will be appearing */}
      <TouchableOpacity onPress={() => missBalloon()} style={styles.balloonContainer}>
        <View style={styles.balloonContainer}>
          {isGameStarted && timeLeft > 0 && balloons.map((color, index) => (
            <Balloon key={index} onPress={() => popBalloon(index)} style={styles.balloon} color={color} />
          ))}
          {timeLeft == 0 && <Text style={styles.gameOver}>Game Over!</Text>}
        </View>
      </TouchableOpacity>

      {/* the score field */}
      <View style={styles.header}>
        <Text style={styles.subTitle}>Score: <Text style={styles.whiteText}>{score}</Text></Text>
      </View>

      {/*start button */}
      <View style={styles.btn}>
        <Button title='Start' onPress={handleStartGame} />
        <Button title='Reset' onPress={handleResetStartGame} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: 'orange',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold'
  },
  subTitle: {
    fontSize: 25,
    fontWeight: 'bold'
  },
  whiteText: {
    color: 'white'
  },
  timer: {
    margin: 10,
    alignSelf: 'center'
  },
  btn: {
    width: '30%',
    marginTop: 10,
    alignSelf: 'center',
    display: 'flex',
    flexDirection: 'row',
    gap: 20
  },
  balloonContainer: {
    backgroundColor: '#f8edeb',
    height: '70%',
    width: '100%',
    flexWrap: 'wrap',
  },
  balloon: {
    width: 80,
    height: 80,
    borderRadius: 50,
    margin: 30,
  },
  gameOver: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'red',
  },

});
