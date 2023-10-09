import React, { useState } from 'react';
import { Modal, View, Animated, StyleSheet, TouchableOpacity } from 'react-native';

const AnimatedModal = ({ visible, animationType, onClose, children, verify }) => {
  const [modalOpacity] = useState(new Animated.Value(0));

  const closeModal = () => {
    Animated.timing(modalOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(onClose);
  };

  const animateModal = () => {
    Animated.timing(modalOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  React.useEffect(() => {
    if (visible) {
      animateModal();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType={animationType} >
      {
        verify &&
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          // onPress={closeModal}
        >
          <Animated.View
            style={[styles.container, { opacity: modalOpacity }]}
          >
            {children}
          </Animated.View>
        </TouchableOpacity>
      }
      {
        !verify &&
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={closeModal}
        >
          <Animated.View
            style={[styles.container, { opacity: modalOpacity }]}
          >
            {children}
          </Animated.View>
        </TouchableOpacity>
      }
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    width: '80%',
    alignItems: 'center',
  },
});

export default AnimatedModal;