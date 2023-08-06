import { NormalButton } from '@/components/Button/NormalButton'
import UncontrolledCard from '@/components/Cards/Card'
import ControlledGrid from '@/components/Grid/Grid'
import { ControlledMultipleSelectField } from '@/components/SelectField/MultipleSelection'
import { ControlledMobileNumberField } from '@/components/TextField/MobileNumberField'
import { ControlledTextField } from '@/components/TextField/TextField'
import { ContactAtom } from '@/utils/hooks/useAccountAdditionValues'
import { ContactSchema, ContactType } from '@/utils/schema/ContactSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Container, Grid, Typography } from '@mui/material'
import { useAtom } from 'jotai'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'

export const ContactUsForm: React.FC = () => {
  const [contact, setContact] = useAtom(ContactAtom)
  const form = useForm<ContactType>({
    mode: 'all',
    resolver: zodResolver(ContactSchema),
    defaultValues: contact
  })
  const {
    handleSubmit,
    formState : { isValid },
    control
  } = form;
  return (
    <>
     <FormProvider {...form}>
      <Container>
          <UncontrolledCard elevation={5} style={{ width: '100%'}}>
            <Typography variant='h6'>Contact Us</Typography>
            <ControlledGrid>
              <Grid item xs={6}>
                <ControlledTextField 
                  control={control}
                  name='firstname'
                  label='Firstname'
                  shouldUnregister
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <ControlledTextField 
                  control={control}
                  name='lastname'
                  label='Lastname'
                  shouldUnregister
                />
              </Grid>
            </ControlledGrid>
            <ControlledGrid>
              <Grid item xs={6}>
                <ControlledTextField 
                  control={control}
                  name='email'
                  label='Email'
                  shouldUnregister
                />
              </Grid>
              <Grid item xs={6}>
                <ControlledMobileNumberField 
                  control={control}
                  name='phoneNumber'
                  shouldUnregister
                  label='Phone number'
                />
              </Grid>
            </ControlledGrid>
            <ControlledMultipleSelectField 
              control={control}
              name='systems'
              options={
                [
                  {
                    label: 'Point of Sales & Inventory System', value: 'POS_INV'
                  },
                  {
                    label: 'Appointment System', value: 'AS'
                  },
                  {
                    label: 'Ticketing System', value: 'TS'
                  }
                ]
              }
              label='Select system for your business'
              shouldUnregister
            />
            <ControlledTextField 
              control={control}
              name='message'
              multiline
              rows={4}
              shouldUnregister
              label='Message'
            />
            <button
                className="group relative flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                style={{
                  float: 'right',
                  marginTop: '10px',
                  marginBottom: '10px',
                  backgroundColor: '#862C64'
                }}
              >
                Submit
              </button>
          </UncontrolledCard>
        </Container>
     </FormProvider>
    </>
  )
}
