import { ControlledTabs } from "@/components/Tabs/Tabs";
import { FieldProps } from "@/pages/hooks/useLayout";
import { useEffect, useState } from "react";
import { Container, Grid } from "@mui/material";
import { UncontrolledCard, ControlledTypography } from "@/components";
import { ControlledTextField } from "@/components/TextField/TextField";
import {
    FormProvider,
    useForm, useFormContext
} from 'react-hook-form'
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { requiredString } from "@/utils/formSchema";
import { ControlledRichTextField } from "@/components/TextField/RichTextField";
import ControlledGrid from "@/components/Grid/Grid";
import { productManagementAtom } from "@/utils/hooks/useAccountAdditionValues";
import { useAtom } from "jotai";
export const productManagementBaseSchema = z.object({
    productName: requiredString("Product name is required."),
    productDescription: requiredString("Product Description is required.")
})
export type ProductManagementCreation = z.infer<typeof productManagementBaseSchema>

const ProductManagementForm = () => {
    const {
        control,
        resetField,
        setValue,
        watch,
        trigger
    } = useFormContext<ProductManagementCreation>()
    const description = watch('productDescription')
    useEffect(() => {
        trigger('productDescription')
    }, [description, trigger])
    const handleChange = (event: string) => {
        setValue('productDescription', JSON.stringify(event))
    }
    return(
        <>
        <ControlledGrid>
            <Grid item xs={6}>
                <ControlledTextField 
                control={control}
                required
                name='productName'
                label='Product Name'
                shouldUnregister
                />
            </Grid>
            <Grid item xs={6}>
                <ControlledRichTextField 
                    handleChange={handleChange}
                />
            </Grid>
        </ControlledGrid>
        </>
    )
}

const ProductManagementBlocks: React.FC<FieldProps> = (props : FieldProps) => {
    const [productManageAtom, setProductManageAtom] = useAtom(productManagementAtom)
    
    const [valueChange, setValueChange] = useState(0)
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValueChange(newValue)
    }
    const form = useForm<ProductManagementCreation>({
        resolver: zodResolver(productManagementBaseSchema),
        mode: 'all',
        defaultValues: productManageAtom
    })
    const {
        formState : { isValid },
        handleSubmit
    } = form;
    return (
        <>
            <ControlledTabs 
                    value={valueChange}
                    handleChange={handleChange}
                    tabsinject={
                        [
                            {
                                label: 'Create Product'
                            },
                            {
                                label: 'Product List'
                            }
                        ]
                    }
                    >
                        {
                            valueChange == 0 ?
                            (
                                <>
                                    <Container
                                    style={{
                                        marginTop: '20px'
                                    }}
                                    >
                                        <UncontrolledCard>
                                            <ControlledTypography 
                                            variant='h6'
                                            isGutterBottom={true}
                                            text='Product Creation'
                                            />
                                            <FormProvider {...form}>
                                                <ProductManagementForm />
                                            </FormProvider>
                                        </UncontrolledCard>
                                    </Container>
                                </>
                            ) : (
                                <></>
                            )
                        }
                    </ControlledTabs>
        </>
    )
}
export default ProductManagementBlocks