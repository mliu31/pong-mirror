import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10
  },
  inputWrapper: {
    width: '90%',
    height: 55,
    backgroundColor: '#f7f9ef',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8
  },
  input: {
    width: '90%',
    height: '100%',
    marginLeft: 10
  },
  buttonWrapper: {
    marginTop: 10,
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 16,
    marginBottom: 5
  }
});
