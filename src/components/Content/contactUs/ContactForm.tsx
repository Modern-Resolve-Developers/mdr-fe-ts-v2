import React from 'react';
import { Container, Grid, FormControlLabel, Checkbox } from '@mui/material';
import { NormalButton } from '@/components/Button/NormalButton';
import { ControlledTextField } from '@/components/TextField/TextField';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ControlledTypography from '@/components/Typography/Typography';
import { requiredString } from "@/utils/formSchema";

const schema = z.object({
  firstName: requiredString("Your firstname is required."),
  lastName: requiredString("Your lastname is required."),
  email: requiredString("Your email is required.").email(),
  message: requiredString("Message is required"),
  pos: z.boolean(),
  tms: z.boolean(),
});

const ContactForm = () => {
  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: any) => {
    console.log(data);
    // Additional steps such as sending the form to a server or processing the data
  };

  return (
    <Container style={{ marginTop: '0' }}>
      <FormProvider {...methods}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ControlledTextField
              control={methods.control}
              name="firstName"
              label="Firstname"
            />
          </Grid>
          <Grid item xs={12} >
            <ControlledTextField
              control={methods.control}
              name="lastName"
              label="Lastname"
            />
          </Grid>
          <Grid item xs={12}>
            <ControlledTextField
              control={methods.control} 
              name="email"
              label="Email"
            />
          </Grid>
          <ControlledTypography 
            variant={'inherit'} 
            text={'Let us know what system you are interested in'}
            style={{
              marginTop: '25px',
              marginLeft: '15px'
            }}
                    
            />
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  {...methods.register('pos')}
                  color="primary"
                />
              }
              label="POS"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  {...methods.register('tms')}
                  color="primary"
                />
              }
              label="TMS"
            />
          </Grid>
          <Grid item xs={12} >
            <ControlledTextField
              control={methods.control}
              name="message"
              label="Message"
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={12}>
            <NormalButton
              variant="outlined"
              color="primary"
              onClick={methods.handleSubmit(onSubmit)}
              style={{
                float: 'right',
                marginTop: '10px',
                marginBottom: '10px',
              }}
            >
              Submit
            </NormalButton>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
};

export default ContactForm;