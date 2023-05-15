import React from 'react';
import BreadCrumb from '~/components/elements/BreadCrumb';
import VendorsRegistration from '~/components/partials/vendor/VendorsRegistration';
import FooterDefault from '~/components/shared/footers/FooterDefault';
import PageContainer from '~/components/layouts/PageContainer';
import Newsletters from '~/components/partials/commons/Newletters';

const vendors = () => {
    const breadCrumb = [
        {
            text: 'Home',
            url: '/',
        },
        {
            text: 'Vendor Registration',
        },
    ];

    return (
        <PageContainer footer={<FooterDefault />} title="Become a vendor">
            <div className="ps-page--single">
                <BreadCrumb breacrumb={breadCrumb} />
            </div>
            <VendorsRegistration />
            <Newsletters layout="container" />
        </PageContainer>
    );
};

export default vendors;
