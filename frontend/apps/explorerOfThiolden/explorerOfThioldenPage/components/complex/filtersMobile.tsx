import styled from "styled-components"
import { TextElMessiri } from "../basic_components"
import CategoryFilter from "../basic_components/categoryFilterMobile"
import ToggleSwitch from "../basic_components/toggleSwitch"
import Image from "next/image"
import { Formik, Form } from "formik";
import { material, faction, classes } from '../../settings'
import { useGeneralDispatch, useGeneralSelector } from "../../../../../features/hooks"
import { selectGeneralReducer } from '../../../../../features/generalReducer'
import { setFilter } from "../../features/explorerOfThiolden"
import { useGetDataFilter } from "../../hooks"

const HeaderContainer = styled.div`
    margin-bottom: -7.246vw;
`
const TitleContainer = styled.div`
    & {

    }
    & p {
        position: relative;
        top: 70px
    }
`



const FiltersMobile = () =>{

    const generalDispatch = useGeneralDispatch()
    const generalSelector = useGeneralSelector(selectGeneralReducer)

    useGetDataFilter();

    return <>
    
    <HeaderContainer>
        <TitleContainer>
            <TextElMessiri fontsize={0} fontsizeMobile={10} color="white" textAlign="center">Search by</TextElMessiri>
        </TitleContainer>
        <Image
            src = "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/filter_mobile/background.png"
            alt = "card drunken dragon"   
            layout = "responsive" 
            width={0.895} 
            height={0.3}
        ></Image>
    </HeaderContainer>

    <Formik
        initialValues = {generalSelector.exploreOfThioldenReducer.data.filter}
        onSubmit = {(values) => {
            generalDispatch(setFilter(values))     
    }}>
        {({ handleChange, submitForm, values }) => (
            <Form>
                <CategoryFilter 
                    title="Material"
                    name="Material" 
                    iconSrc='https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/filter_icons/material_icon.png'
                    selected ={ values.Material == ""}
                    value=""
                    onChange={(e: React.FormEvent<HTMLInputElement>) => {
                        handleChange(e);
                        submitForm();
                    }}
                >
                        {   material.map((option)=>{
                            return <ToggleSwitch 
                                name="Material"
                                value={option} 
                                key={option} 
                                selected ={ values.Material == option}
                                onChange={(e: React.FormEvent<HTMLInputElement>) => {
                                    handleChange(e);
                                    submitForm();
                                }}
                            >{option}</ToggleSwitch>
                        })}
                    </CategoryFilter>
                    <CategoryFilter 
                        title="Faction"
                        name="Faction" 
                        iconSrc='https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/filter_icons/faction_icon.png'
                        selected ={ values.Faction == ""}
                        value=""
                        onChange={(e: React.FormEvent<HTMLInputElement>) => {
                            handleChange(e);
                            submitForm();
                        }}
                    >
                            
                        {faction.map((option)=>{
                            return <ToggleSwitch 
                                        name="Faction"
                                        value={option} 
                                        key={option} 
                                        selected ={ values.Faction == option}
                                        onChange={(e: React.FormEvent<HTMLInputElement>) => {
                                            handleChange(e);
                                            submitForm();
                                        }}
                                    >{option}</ToggleSwitch>
                        })}
                    </CategoryFilter>
                    <CategoryFilter 
                        title="Class"
                        name="Game Class" 
                        iconSrc='https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/filter_icons/class_icon.png'
                        value = ""
                        selected ={ values["Game Class"] == ""} 
                        onChange={(e: React.FormEvent<HTMLInputElement>) => {
                            handleChange(e);
                            submitForm();
                        }}
                    >
                        {classes.map((option)=>{
                            return <ToggleSwitch 
                                        name="Game Class"
                                        value={option}
                                        selected ={ values["Game Class"] == option} 
                                        key={option} 
                                        onChange={(e: React.FormEvent<HTMLInputElement>) => {
                                            handleChange(e);
                                            submitForm();
                                        }}
                                    >{option}</ToggleSwitch>
                        })}
                    </CategoryFilter>
                </Form>
            )}
        </Formik>
    </>
        
}

export default FiltersMobile