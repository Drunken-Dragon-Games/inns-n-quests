import styled from "styled-components"
import { Select, SelectIcon } from "../basic_components"
import { material, faction, classes } from '../../settings'
import { Formik, Form } from "formik";
import { setFilter } from "../../features/explorerOfThiolden";
import { useGeneralDispatch, useGeneralSelector } from "../../../../../features/hooks";
import { selectGeneralReducer } from "../../../../../features/generalReducer";
import { useGetDataFilter } from "../../hooks";

const FilterComponent = styled.div`
    position: relative;
    width: 14vw;
    height: 4vw;
`


const FilterWrapper = styled.div`
    display: flex;
    
`

const MarginRight =styled.div`
    margin-right: 1.979vw;
    &: last-child{
        margin-right: 0vw;
    }
`
const FilterActive =styled.div`
    width: 1.9vw;
    height: 1.9vw;
    position: absolute;
    right: 0vw;
    top: 1.2vw;
`

const Filter = () =>{

    const generalDispatch = useGeneralDispatch()

    const generalSelector = useGeneralSelector(selectGeneralReducer)
    
    useGetDataFilter();
    
    return (
    <>
        <FilterComponent>
            <Formik
                initialValues = {generalSelector.exploreOfThioldenReducer.data.filter}
                onSubmit = {(values) => {
                    generalDispatch(setFilter(values))
            }}>
                {({ handleChange, submitForm, values }) => (
                    <Form>
                        <FilterWrapper>
                            <MarginRight>
                                <Select 
                                    icon="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/filter_icons/material_icon.png"
                                    icon_src_active="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/filter_icons/material_icon_selected.png" 
                                    options = {material}
                                    name= 'Material'
                                    selectedValue={values.Material}
                                    onChange={(e: React.FormEvent<HTMLInputElement>) => {
                                        handleChange(e);
                                        submitForm();
                                    }}
                                >Material</Select>
                            </MarginRight>

                            <MarginRight>
                                <Select 
                                    icon = "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/filter_icons/faction_icon.png" 
                                    icon_src_active="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/filter_icons/faction_icon_selected.png"
                                    options = {faction}
                                    name = "Faction"
                                    selectedValue={values.Faction}
                                    onChange={(e: React.FormEvent<HTMLInputElement>) => {
                                        handleChange(e);
                                        submitForm();
                                    }}
                                >Faction</Select>
                            </MarginRight>

                            <MarginRight>
                                <Select 
                                    icon="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/filter_icons/class_icon.png" 
                                    icon_src_active="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/filter_icons/class_icon_selected.png"
                                    options = {classes} 
                                    textAlign="right"
                                    name = "Game Class"
                                    selectedValue={values["Game Class"]}
                                    onChange={(e: React.FormEvent<HTMLInputElement>) => {
                                        handleChange(e);
                                        submitForm();
                                    }}
                                >Class</Select>
                            </MarginRight>
                            
                        </FilterWrapper>

                        <FilterActive>
                            <SelectIcon 
                                isActive = {values["Game Class"] !== "" || values.Faction !== "" || values.Material !== "" }  
                                icon_src="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/filter_icons/active_icon.png"  
                                icon_src_active="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/filter_icons/active_icon_selected.png"  />
                        </FilterActive>
                        
                    </Form>
                )}
            </Formik>
        </FilterComponent>
       
    </>)
}

export default Filter