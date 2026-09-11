import axios from 'axios'

interface SendOtpProps {
  mobile: string
  otp: string
}

export const sendOtp = async ({ mobile, otp }: SendOtpProps) => {
  try {
    const message = `Dear User, Your one-time password (otp) is ${otp}. Please don't share with anyone. Super Chennai.`

    const url = 'https://www.smsintegra.net/api/smsapi.aspx'

    const params = {
      uid: process.env.SMS_UID,
      pwd: process.env.SMS_PWD,
      mobile,
      msg: message,
      sid: process.env.SMS_SID,
      type: 0,
      dtTimeNow: new Date().toISOString(),
      entityid: process.env.SMS_ENTITY_ID,
      tempid: process.env.SMS_TEMPLATE_ID,
    }

    // console.log('📤 SMS PARAMS:', params)

    const response = await axios.get(url, {
      params,
    })

    // console.log('✅ SMS RESPONSE:', response.data)

    return response.data
  } catch (error: any) {
    console.log('❌ SMS ERROR')

    if (error.response) {
      console.log(error.response.data)
    } else {
      console.log(error.message)
    }

    throw error
  }
}
