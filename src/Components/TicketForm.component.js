/* eslint-disable prettier/prettier */
import React, {useState, useCallback} from 'react';
import {View, StyleSheet, Modal} from 'react-native';
import Text from '../Utils/Text';
import moment from 'moment';
import {Button, useTheme} from 'react-native-paper';
import {DatePickerModal, TimePickerModal} from 'react-native-paper-dates';
import TextInput from '../Utils/TextInput';
import PickerInput from './PickerInput.component';
import {useDispatch} from 'react-redux';
import IconButton from './IconButton.component';
import {addTicket} from '../Store/movieSlice';

const initalForm = {
  title: null,
  date: null,
  time: null,
  location: null,
  screen: null,
  seats: null,
};

const TicketForm = ({modalVisible, setModalVisible}) => {
  const {colors} = useTheme();
  const dispatch = useDispatch();

  const [form, setForm] = useState(initalForm);
  const [timeVisible, setTimeVisible] = useState(false);
  const [dateVisible, setDateVisible] = useState(false);
  const [dateValue, setDateValue] = useState(null);

  const submit = () => {
    dispatch(addTicket(form)).then(value => {
      closeModal();
    });
  };

  const closeModal = () => {
    setModalVisible(false);
    setForm(initalForm);
  };

  const onValueChange = (field, value) => {
    setForm(prev => ({...prev, [field]: value}));
  };

  const onTimeConfirm = useCallback(
    ({hours, minutes}) => {
      setTimeVisible(false);
      let meridian = 'am';
      let formattedHours = hours;
      if (hours > 12 || hours === 0) {
        meridian = 'pm';

        if (formattedHours > 12) {
          formattedHours = formattedHours - 12;
        }
      }

      if (formattedHours < 10) {
        formattedHours = `0${formattedHours}`;
      }
      const formatTime = `${formattedHours}:${minutes}${meridian}`;
      onValueChange('time', formatTime);
    },
    [setTimeVisible],
  );

  const onTimeDismiss = useCallback(() => {
    setTimeVisible(false);
  }, [setTimeVisible]);

  const onDateConfirm = useCallback(
    params => {
      setDateValue(params.date);
      setDateVisible(false);
      const formatDate = moment(params.data).format('ddd, D MMM, YYYY');
      onValueChange('date', formatDate);
    },
    [setDateVisible],
  );

  const onDateDismiss = useCallback(() => {
    setDateVisible(false);
  }, [setDateVisible]);

  return (
    <Modal
      transparent={true}
      visible={modalVisible}
      statusBarTranslucent={true}
      onRequestClose={() => setModalVisible(false)}>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <View style={[styles.container, {backgroundColor: 'rgba(0, 0, 0, 0.4)'}]}>
        <View style={[styles.formCard, {backgroundColor: colors.card}]}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <IconButton icon="close" onPress={closeModal} />
            </View>
            <View style={styles.headerRight}>
              <Text variant="titleLarge">Add New Ticket</Text>
            </View>
            <View style={styles.headerLeft} />
          </View>
          <View style={styles.formWrapper}>
            <TextInput
              label="Title"
              onValueChange={onValueChange}
              value={form.title}
            />
            <PickerInput
              onPress={() => setDateVisible(true)}
              onValueChange={onValueChange}
              label="Date"
              value={form.date}
            />
            <DatePickerModal
              locale="en"
              mode="single"
              visible={dateVisible}
              onDismiss={onDateDismiss}
              onConfirm={onDateConfirm}
              date={dateValue}
            />
            <PickerInput
              onPress={() => setTimeVisible(true)}
              onValueChange={onValueChange}
              label="Time"
              value={form.time}
            />
            <TimePickerModal
              visible={timeVisible}
              onDismiss={onTimeDismiss}
              onConfirm={onTimeConfirm}
              hours={12}
              minutes={14}
            />
            <TextInput
              label="Location"
              onValueChange={onValueChange}
              value={form.location}
            />
            <TextInput
              label="Screen"
              onValueChange={onValueChange}
              value={form.screen}
            />
            <TextInput
              label="Seats"
              onValueChange={onValueChange}
              value={form.seats}
            />
          </View>
          <Button mode="contained" onPress={submit}>
            Submit
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formCard: {
    width: '90%',
    height: '78%',
    borderRadius: 30,
    paddingHorizontal: 16,
    justifyContent: 'space-evenly',
    paddingBottom: 12,
  },
  formWrapper: {justifyContent: 'center', alignItems: 'center'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLeft: {flex: 1},
  headerRight: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TicketForm;
